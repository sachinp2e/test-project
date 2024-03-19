import React, { ChangeEvent, useState, useRef, useEffect, useMemo } from 'react';
import { UploadIcon } from '@/Assets/svg';
import Image from 'next/image';
import PdfIcon from '@/Assets/_images/pdf-icon.png';
import './fileupload.scss';

interface MediaUploadButtonProps {
  onFileSelect?: (name: string, file: File) => void;
  buttonLabel: string;
  buttonClassName?: string;
  accept: string; // Specify allowed file types, e.g., 'image/*, .pdf, .doc, .docx'
  htmlFor: string;
  isPreview?: boolean;
  value?: File | string | null;
  isDisabled?: boolean;
}

const MediaUploadButton: React.FC<MediaUploadButtonProps> = ({
  onFileSelect,
  accept,
  buttonLabel,
  buttonClassName = '',
  htmlFor,
  value = null,
  isPreview,
  isDisabled
}) => {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if(isDisabled){
      return
    }
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(event.target.name, file);
      }
    }
  };

  const onButtonClick = () => {
    if (fileInput && fileInput.current) {
      fileInput.current.click();
    }
  };

  useEffect(() => {
    setSelectedFile(value);
  }, [value]);

  const isAbleToPreview: 'NAME' | 'PDF' | 'FILE' = useMemo(() => {
    if (isPreview && typeof selectedFile === 'string') {
      return 'FILE';
    }
    if (isPreview && selectedFile && selectedFile.type.includes('pdf')) {
      return 'PDF';
    }
    if (isPreview && selectedFile && selectedFile.type.includes('image')) {
      return 'FILE';
    }
    return 'NAME';
  }, [selectedFile]);

  const imgSrc = useMemo(()=>{
    if(typeof value === 'string'){
      return value
    }
    return value ? URL.createObjectURL(selectedFile || value) : ''
  },[value])

  return (
    <div className="custom-file-container">
      <label htmlFor={htmlFor} className="media-file">
        {selectedFile ? (
          (isPreview && isAbleToPreview === 'FILE') ? (
            <Image
              src={imgSrc}
              width={140}
              height={140}
              alt=""
            />
          ) : isAbleToPreview === 'PDF'
            ? (
              <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100">
                <Image
                  src={PdfIcon}
                  alt="pdf-icon"
                  quality={100}
                  width={30}
                  height={30}
                  className="pdf-image"
                />
                <p className="p-2">{(selectedFile?.name || selectedFile).slice(0, 50)}</p>
              </div>
            ) : <p className="p-2">{selectedFile?.name || selectedFile}</p>
        ) : (
          <UploadIcon />
        )}
      </label>
      <label className="custom-file-upload" htmlFor="media-file">
        <input
          ref={fileInput}
          type="file"
          id={htmlFor}
          name={htmlFor}
          accept={accept}
          onChange={handleFileChange}
          disabled={isDisabled}
          style={{ display: 'none' }}
        />
      </label>
      <label className={`upload-button ${buttonClassName} ${isDisabled && 'disabled'}`} htmlFor="media-file" onClick={onButtonClick}>
        {buttonLabel}
      </label>
    </div>
  );
};

export default MediaUploadButton;
