export interface ClassifyResponse {
  filename: string;
  file_type: string;
  success: boolean;
  converted_txt: string;
  message: string;
}

export interface UploadResponse {
  status: string;
  message: string;
  notice_id: number;
}

export interface DocConvertResponse {
  status: string;
  document_id: number;
  is_converted: boolean;
}

export interface HwpConvertResponse {
  status: string;
  document_id: number;
  is_converted: boolean;
}

export interface PdfConvertResponse {
  status: string;
  document_id: number;
  is_converted: boolean;
  filename: string;
}

export interface SearchResultItem {
  id: number;
  'file name': string;
  'file 미리보기': string; 
}

export interface SearchResponse {
  status: string;
  keyword: string;
  matched_count: number;
  matched_results: SearchResultItem[];
}
