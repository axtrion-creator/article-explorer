import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { Article, ImportedData } from '../types';

export const parseExcelFile = async (file: File): Promise<ImportedData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('No data found in file'));
          return;
        }

        let parsedData: ImportedData[] = [];

        if (file.name.endsWith('.csv')) {
          // Parse CSV
          Papa.parse(data as string, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              parsedData = results.data as ImportedData[];
              resolve(parsedData);
            },
            error: (error: any) => {
              reject(error);
            }
          });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // Parse Excel
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          parsedData = jsonData as ImportedData[];
          resolve(parsedData);
        } else {
          reject(new Error('Unsupported file format'));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  });
};

export const convertToArticles = (data: ImportedData[]): Article[] => {
  return data.map((item, index) => ({
    id: crypto.randomUUID(),
    title: item.title || `Untitled Article ${index + 1}`,
    authors: item.authors || 'Unknown Author',
    year: item.year || new Date().getFullYear(),
    status: 'not-started' as const,
    abstract: item.abstract,
    doi: item.doi,
    url: item.url
  }));
};
