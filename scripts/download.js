import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a file to stream archive data to
const output = fs.createWriteStream('employee-happiness-survey.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', () => {
  console.log(`Archive created successfully - ${archive.pointer()} total bytes`);
});

// Handle warnings and errors
archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Function to ignore certain files and directories
const shouldIgnore = (file) => {
  const ignoreList = [
    'node_modules',
    'dist',
    '.git',
    '.DS_Store',
    'employee-happiness-survey.zip'
  ];
  return ignoreList.some(ignored => file.includes(ignored));
};

// Function to recursively add files to the archive
const addDirectoryToArchive = (dirPath, archivePath = '') => {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);

    if (shouldIgnore(filePath)) {
      return;
    }

    if (stats.isDirectory()) {
      addDirectoryToArchive(filePath, path.join(archivePath, file));
    } else {
      archive.file(filePath, { name: path.join(archivePath, file) });
    }
  });
};

// Add package.json first
archive.file('package.json', { name: 'package.json' });

// Add all other project files
addDirectoryToArchive('.');

// Finalize the archive
archive.finalize();