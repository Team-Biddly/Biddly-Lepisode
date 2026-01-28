import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BusinessInfoService,
  CreateBusinessInfoDto,
  FileDto,
} from '@api-client';
import { UploadFile } from '@common';
import { FileUploader } from '../../components/file-uploader/file-uploader.component';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-business-info',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FileUploader],
  templateUrl: './business-info.page.html',
  styleUrl: './business-info.page.css',
})
export default class BusinessInfoPage implements OnInit {
  private readonly businessInfoService = inject(BusinessInfoService);
  private readonly uploadService = inject(UploadService);

  form = new FormGroup({
    logo: new FormControl<UploadFile[]>(
      [],
      [Validators.required, Validators.minLength(1)],
    ),
    businessName: new FormControl('', [Validators.required]),
    representativeName: new FormControl('', [Validators.required]),
    businessRegistrationNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    customerServiceCenter: new FormControl('', [Validators.required]),
  });

  businessInfoId: string | null = null;

  uploadHandler = this.uploadService.upload;
  deleteHandler = this.uploadService.delete;

  ngOnInit(): void {
    this.loadBusinessInfo();
  }

  loadBusinessInfo(): void {
    this.businessInfoService.businessInfoControllerGetBusinessInfo().subscribe({
      next: (info) => {
        this.businessInfoId = info.id;
        this.form.patchValue({
          logo: info.logo
            ? [
                {
                  id: info.logo.id,
                  url: info.logo.url,
                  name: info.logo.name,
                  size: info.logo.size,
                  mimeType: info.logo.mimeType,
                  createdAt: info.logo.createdAt,
                  status: 'SUCCESS',
                } as UploadFile,
              ]
            : [],
          businessName: info.businessName,
          representativeName: info.representativeName,
          businessRegistrationNumber: info.businessRegistrationNumber,
          email: info.email,
          address: info.address,
          customerServiceCenter: info.customerServiceCenter,
        });
      },
    });
  }

  async submit(ev?: Event): Promise<void> {
    ev?.stopPropagation();
    ev?.preventDefault();

    if (this.form.invalid) {
      alert('모든 필드를 올바르게 입력해주세요.');
      return;
    }

    const body: CreateBusinessInfoDto = {
      logo: this.form.getRawValue().logo?.[0] as FileDto,
      businessName: this.form.getRawValue().businessName as string,
      representativeName: this.form.getRawValue().representativeName as string,
      businessRegistrationNumber: this.form.getRawValue()
        .businessRegistrationNumber as string,
      email: this.form.getRawValue().email as string,
      address: this.form.getRawValue().address as string,
      customerServiceCenter: this.form.getRawValue()
        .customerServiceCenter as string,
    };

    if (this.businessInfoId) {
      this.businessInfoService
        .businessInfoControllerUpdate({ body })
        .subscribe({
          next: () => {
            alert('사업자 정보가 수정되었습니다.');
          },
          error: (err) => {
            console.error(err);
            alert('사업자 정보 수정에 실패했습니다.');
          },
        });
    } else {
      this.businessInfoService
        .businessInfoControllerCreate({ body })
        .subscribe({
          next: () => {
            alert('사업자 정보가 등록되었습니다.');
          },
          error: (err) => {
            console.error(err);
            alert('사업자 정보 등록에 실패했습니다.');
          },
        });
    }
  }
}
