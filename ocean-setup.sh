#!/bin/zsh

sudo apt-get update && apt-get install -y poppler-utils imagemagick ghostscript tesseract-ocr nodejs npm
sudo mkdir srcctrl
sudo cd srcctrl
sudo git clone https://github.com/SilasReinagel/PdfTextExtractorApi/
sudo cd PdfTextExtractorApi
sudo npm install
