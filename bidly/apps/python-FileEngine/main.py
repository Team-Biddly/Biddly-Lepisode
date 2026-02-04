from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os

from classification import FileClassifier
from converters.doc_converter import DocConverter
from converters.hwp_converter import HwpConverter
from converters.pdf_converter import PdfConverter

app = FastAPI(
    title="File to Txt Converter",
    description="File to Txt Converter with Classifier",
    version="v1",
)

# Init
classifier = FileClassifier()
hwp_converter = HwpConverter()
doc_converter = DocConverter()
pdf_converter = PdfConverter()

class UrlProcessingRequest(BaseModel):
    file_url: str

class ExtractedTextResponse(BaseModel):
    extracted_text: str

@app.post("/extract-text", tags=["conversion"], response_model=ExtractedTextResponse)
async def extract_text_from_url(request: UrlProcessingRequest):
    """
    S3 URL에서 파일 다운로드 및 텍스트로 변환.
    - file_url: The URL of the file to process.
    """
    try:
        # Download the file from the URL
        response = requests.get(request.file_url, stream=True, timeout=10)
        response.raise_for_status()
        file_content = response.content
        
        # 1. Content-Disposition 헤더에서 파일명 추출 시도
        content_disposition = response.headers.get('Content-Disposition')
        file_name = ""
        if content_disposition and 'filename=' in content_disposition:
            import re
            # filename="abc.pdf" 또는 filename=abc.pdf 추출
            filenames = re.findall('filename="?([^"]+)"?', content_disposition)
            if filenames:
                file_name = filenames[0]

        # 2. 헤더에 없으면 URL에서 추출
        if not file_name:
            file_name = os.path.basename(request.file_url.split('?')[0])

        # 3. 확장자가 없거나 .do인 경우 Content-Type으로 보정
        file_type = classifier.classify(file_name)
        if file_type == "other":
            content_type = response.headers.get('Content-Type', '').lower()
            if 'pdf' in content_type:
                file_type = 'pdf'
            elif 'hwp' in content_type:
                file_type = 'hwp'
            elif 'msword' in content_type or 'officedocument.wordprocessingml' in content_type:
                file_type = 'doc'

        text = ""
        success = False

        # Process the file based on its type
        if file_type in ["hwp", "hwpx"]:
            text, success = hwp_converter.hwp_to_txt(file_content, file_name or "document.hwp")
        elif file_type in ["doc", "docx"]:
            text, success = doc_converter.doc_to_txt(file_content, file_name or "document.docx")
        elif file_type == "pdf":
            text, success = pdf_converter.pdf_to_txt(file_content)
        else:
            raise HTTPException(status_code=400, detail=f"지원하지 않는 파일 형식 또는 감지 불가: {file_type} (Content-Type: {response.headers.get('Content-Type')})")

        if not success:
            raise HTTPException(status_code=500, detail=f"파일 변환 실패: {text}")

        return {"extracted_text": text}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"파일 다운로드 실패: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"알 수 없는 오류 발생: {e}")
