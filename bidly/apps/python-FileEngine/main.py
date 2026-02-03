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
        response = requests.get(request.file_url, stream=True)
        response.raise_for_status()  # Raise an exception for bad status codes
        file_content = response.content
        
        # Get filename from URL
        file_name = os.path.basename(request.file_url)

        # Classify the file based on its extension
        file_type = classifier.classify(file_name)

        text = ""
        success = False

        # Process the file based on its type
        if file_type == "hwp" or file_type == "hwpx":
            text, success = hwp_converter.hwp_to_txt(file_content, file_name)
        elif file_type == "doc" or file_type == "docx":
            text, success = doc_converter.doc_to_txt(file_content, file_name)
        elif file_type == "pdf":
            text, success = pdf_converter.pdf_to_txt(file_content)
        else:
            raise HTTPException(status_code=400, detail=f"지원하지 않는 파일 형식: {file_type}")

        if not success:
            raise HTTPException(status_code=500, detail=f"파일 변환 실패: {text}")

        return {"extracted_text": text}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"파일 다운로드 실패: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"알 수 없는 오류 발생: {e}")
