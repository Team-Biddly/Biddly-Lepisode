import { mergeAttributes, Node } from '@tiptap/core';

export interface TableCellOptions {
  HTMLAttributes: Record<string, any>;
}

export const CustomTableCell = Node.create<TableCellOptions>({
  name: 'tableCell',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: 'block+',

  addAttributes() {
    return {
      backgroundColor: {
        default: null,
        renderHTML: (attributes: any) => {
          if (!attributes['backgroundColor']) {
            return {};
          }

          return {
            style: `background-color: ${attributes['backgroundColor']}`,
          };
        },
        parseHTML: (element: any) =>
          element.style.backgroundColor.replace(/"/g, ''),
      },
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
        parseHTML: (element: any) => {
          const colwidth = element.getAttribute('colwidth');
          const value = colwidth ? [parseInt(colwidth, 10)] : null;

          return value;
        },
      },
    };
  },

  tableRole: 'cell',

  isolating: true,

  parseHTML() {
    return [{ tag: 'td' }];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: any }) {
    return [
      'td',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
