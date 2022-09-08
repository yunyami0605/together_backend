import { InternalServerErrorException } from '@nestjs/common';
import { TmpImageEntity } from 'src/entity/tmpImg.entity';
import { EntityRepository, Repository } from 'typeorm';

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
    const KOREAN_TIME_THRES_VALUE = 18 * 60 * 60 * 1000;
    const currentTime = new Date();
    const utc =
      currentTime.getTime() + currentTime.getTimezoneOffset() * 60 * 1000;

    const DIFF_DELETE_THRES = 5 * 60 * 1000;

    const deleteTime = new Date(
      utc + KOREAN_TIME_THRES_VALUE - DIFF_DELETE_THRES,
    );

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
