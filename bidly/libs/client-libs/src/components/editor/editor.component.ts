import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Editor } from '@tiptap/core';
import Color from '@tiptap/extension-color';
import { Level } from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { Icon } from '../icon/icon.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkMenuModule, Icon, TooltipDirective],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EditorComponent,
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements AfterViewInit, ControlValueAccessor {
  // readonly uploadService = inject(UploadService);

  editorRef = viewChild<ElementRef<HTMLElement>>('editorRef');
  format = input<'html' | 'json'>('html');
  image = input<boolean>(true);
  viewer = input<boolean, string>(false, { transform: booleanAttribute });
  minHeight = input<string>('300px');

  // 파일 업로드
  // baseUrl = input.required<string>();
  // container = input.required<string>();
  uploadHandler = input.required<(file: File) => Promise<any>>();
  deleteHandler = input.required<(url: string) => Promise<void>>();

  disabled = input<boolean>(false);

  public editor?: any;

  isCurrentNodeTable = signal<boolean>(false);
  currentNodeTextSize = signal<string>('h1');
  currentTextAlign = signal<string>('left');
  currentTextAlignIcon = computed(
    () => `mdi:format-align-${this.currentTextAlign()}`,
  );

  colors = [
    '#fff',
    '#d4d4d4',
    '#737373',
    '#3f3f46',
    '#0a0a0a',
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
  ];

  ngAfterViewInit(): void {
    this.initializeEditor();
  }

  handleCommand(command: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    command();
  }

  private initializeEditor() {
    if (this.editor) return;
    this.editor = new Editor({
      element: this.editorRef()?.nativeElement,
      extensions: [
        StarterKit.configure({
          paragraph: {
            HTMLAttributes: {
              class: 'min-h-[1rem]',
            },
          },
        }),

        Underline,
        Image.configure({ allowBase64: false }),
        Color,
        TextStyle,
        TextAlign.configure({
          types: ['paragraph', 'heading'],
        }),
        Highlight.configure({
          multicolor: true,
        }),
        // Table.configure({ resizable: true }),
        // TableRow,
        // CustomTableCell,
        // TableHeader,
        Link.configure({
          autolink: true,
          defaultProtocol: 'https',
        }),
      ],
      onTransaction: ({ editor, transaction }) => {
        // check if image node was deleted
        this.handleImageDelete(transaction);
        this.detectTextSize(editor);
        this.detectTextAlign(editor);
      },
      onSelectionUpdate: ({ editor }) => {
        this.detectTextSize(editor);
      },
      onUpdate: ({ editor }) => {
        switch (this.format()) {
          case 'html':
            this.onChange(editor.getHTML());
            break;
          case 'json':
            this.onChange(JSON.stringify(editor.getJSON()));
            break;
        }
      },
      onCreate: ({ editor }) => {
        editor.view.dom.spellcheck = false;
        if (this.disabled()) {
          editor.setEditable(false);
        }
      },
    });
  }

  async selectImage(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const a = document.createElement('input');
    a.type = 'file';
    a.accept = 'image/*';
    a.click();
    a.onchange = async (e) => {
      const file = (e.target as any)?.files[0];
      try {
        const uploaded = await this.uploadHandler()(file);
        this.editor?.chain().focus().setImage({ src: uploaded.url }).run();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
  }

  detectTextSize(editor: Editor) {
    const currentNode = editor.state.selection.$from.node();
    if (currentNode.type.name === 'paragraph')
      this.currentNodeTextSize.set('p');
    if (currentNode.type.name === 'heading') {
      switch (currentNode.attrs['level']) {
        case 1:
          this.currentNodeTextSize.set('h1');
          break;
        case 2:
          this.currentNodeTextSize.set('h2');
          break;
        case 3:
          this.currentNodeTextSize.set('h3');
          break;
      }
    }
  }

  detectTextAlign(editor: Editor) {
    const currentNode = editor.state.selection.$from.node();
    if (currentNode.attrs['textAlign']) {
      this.currentTextAlign.set(currentNode.attrs['textAlign']);
    } else {
      this.currentTextAlign.set('left');
    }
  }

  changeTextNode(size: 'h1' | 'h2' | 'h3' | 'p') {
    if (size === 'p') {
      this.editor?.chain().focus().setParagraph().run();
      return;
    }

    this.editor!.chain()
      .focus()
      .setHeading({ level: parseInt(size[1]) as Level })
      .run();
  }

  handleImageDelete(transaction: Transaction) {
    const current: Node[] = [];
    transaction.doc.content.forEach((node) => {
      if (node.type.name == 'image') {
        current.push(node);
      }
    });
    const before: Node[] = [];
    transaction.before.content.forEach((node) => {
      if (node.type.name == 'image') {
        before.push(node);
      }
    });
    if (!current || before.length == 0) {
      return;
    }

    const deletedImageNodes = before.filter((node) => {
      const src = node.attrs['src'];
      return !current.find((curNode) => curNode.attrs['src'] == src);
    });

    if (deletedImageNodes.length > 0) {
      deletedImageNodes.forEach(async (node) => {
        try {
          await this.deleteHandler()(node.attrs['src']);
        } catch (error) {
          console.error('Failed to delete image:', error);
        }
      });
    }
  }

  writeValue(content: any): void {
    if (!this.editor) this.initializeEditor();
    if (this.format() === 'html') {
      // check content is html
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      if (doc.body.innerHTML !== '') {
        this.editor?.commands.setContent(content);
      } else {
        // console.error('Selected format is HTML but the content is not HTML.');
      }
      this.editor?.commands.setContent(content);
    } else if (this.format() === 'json') {
      try {
        const json = JSON.parse(content);
        this.editor?.commands.setContent(json);
      } catch (error) {
        console.error('Selected format is JSON but the content is not JSON.');
      }
    }
  }

  addYoutube(src: string) {
    this.editor?.commands.setYoutubeVideo({
      src,
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.editor?.setEditable(!isDisabled);
  }

  onChange = (value: string) => {};
  onTouched = () => {};

  isYoutubeUrl(url: string) {
    function isHostYoutube(url: string) {
      return ['youtube.com', 'youtu.be']?.some((host) => url?.includes(host));
    }

    function hasVideoId(url: string) {
      const videoId = url.split('v=')[1];
      return videoId;
    }

    return isHostYoutube(url) && hasVideoId(url);
  }

  getYouTubeVideoId(url: string) {
    const videoId = url.split('v=')[1];
    return videoId;
  }
}
