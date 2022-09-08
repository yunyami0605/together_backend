import { InternalServerErrorException } from '@nestjs/common';
import { TmpImageEntity } from 'src/entity/tmpImg.entity';
import { EntityRepository, Repository } from 'typeorm';
import * as fs from 'fs';

@EntityRepository(TmpImageEntity)
export class TmpImgRepository extends Repository<TmpImageEntity> {
  /**
   * @description create tmp img when add img file on create board
   * @param {string} filename - tmp img filename
   */
  async createTmpImg(filename: string) {
    try {
      const tmpImgEntity = this.create({ filename });

      await this.save(tmpImgEntity);

      return filename;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   *@description 기간이 만료된 tmp 이미지를 모두 제거
   */
  async deleteAllTmpImg() {
    // 한국 시간 설정 값
    const KOREAN_TIME_THRES_VALUE = 18 * 60 * 60 * 1000;
    const currentTime = new Date();
    const utc =
      currentTime.getTime() + currentTime.getTimezoneOffset() * 60 * 1000;

    // 임시 이미지가 생성하고 유지될 시간
    const DIFF_DELETE_THRES = 180 * 60 * 1000;

    // 삭제 기준 시간
    const deleteTime = new Date(
      utc + KOREAN_TIME_THRES_VALUE - DIFF_DELETE_THRES,
    );

    const res = await this.createQueryBuilder()
      .select()
      .where('createdAt < :deleteTime', { deleteTime })
      .getMany();

    if (!res.length) return;

    // 임시 파일 삭제 로직
    res.forEach(async (item) => {
      fs.unlink(`${item.filename}`, (err) => {});
    });

    // db에 임시 파일 데이터 삭제
    this.createQueryBuilder()
      .delete()
      .where('createdAt < :deleteTime', { deleteTime })
      .execute();
  }

  /**
   *@description delete tmp img when adding board is success and, tmp img has expired.
   *@param {string} filename - tmp img filename to delete on db
   */
  async deleteTmpImg(filename: string) {
    try {
      const tmp = filename.split(';');

      const tmpArray = tmp || [filename];

      tmpArray.forEach((val) => {
        this.delete({ filename: val });
      });

      return 1;
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }
}
