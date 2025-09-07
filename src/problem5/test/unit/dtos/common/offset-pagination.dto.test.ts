import { OffsetPaginationDto, PageOffsetOptionsDto } from '@/dtos';

describe('OffsetPaginationDto', () => {
  it('should calculate pagination metadata correctly', () => {
    const pageOptions = new PageOffsetOptionsDto();
    Object.assign(pageOptions, { page: 2, limit: 10 });

    const dto = new OffsetPaginationDto(55, pageOptions);

    expect(dto.limit).toBe(10);
    expect(dto.currentPage).toBe(2);
    expect(dto.totalRecords).toBe(55);
    expect(dto.totalPages).toBe(Math.ceil(55 / pageOptions.limit));
  });

  it('should handle limit = 0', () => {
    const pageOptions = new PageOffsetOptionsDto();
    Object.assign(pageOptions, { page: 1, limit: 0 });

    const dto = new OffsetPaginationDto(55, pageOptions);

    expect(dto.limit).toBe(0);
    expect(dto.currentPage).toBe(1);
    expect(dto.totalRecords).toBe(55);
    expect(dto.totalPages).toBe(0);
  });
});
