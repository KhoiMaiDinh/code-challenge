import { PageOffsetOptionsDto } from '@/dtos';
import { plainToInstance } from 'class-transformer';

describe('PageOptionsDto', () => {
  it('should calculate offset correctly when page and limit are set', () => {
    const input = { page: 3, limit: 20 };
    const dto = plainToInstance(PageOffsetOptionsDto, input, {
      exposeDefaultValues: true,
    });

    expect(dto.offset).toBe(40);
  });

  it('should default offset to 0 when page is missing', () => {
    const input = {};
    const dto = plainToInstance(PageOffsetOptionsDto, input, {
      exposeDefaultValues: true,
    });

    const offset = dto.offset;
    expect(offset).toBe(0);
  });

  it('should convert page and limit to number if input is string', () => {
    const input = { page: '3', limit: '20' };
    const dto = plainToInstance(PageOffsetOptionsDto, input);
    expect(dto.page).toBe(3);
    expect(dto.limit).toBe(20);
  });
});
