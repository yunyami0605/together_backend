import * as fs from 'fs';

export function deleteFile(path: string, cb: fs.NoParamCallback = (err) => {}) {
  fs.unlink(`${path}`, cb);
}
