#!/bin/bash
md2pdf --pdf-options '{"format": "Legal", "printBackground": true}' --stylesheet prompter.css war-pigs.md && open war-pigs.pdf
