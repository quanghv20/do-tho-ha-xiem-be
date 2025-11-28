import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;

  // Mock service để test controller mà không cần database
  const mockCategoryService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  // Kiểm tra controller có được tạo không
  it('Controller phải được định nghĩa', () => {
    expect(controller).toBeDefined();
  });

  // ----------- LẤY DANH SÁCH -----------
  it('Phải trả về mảng danh mục', async () => {
    const result = [
      { id: 1, code: 'A', name: 'DanhMucA', description: '', sortOrder: 1 },
    ];
    mockCategoryService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
    expect(mockCategoryService.findAll).toHaveBeenCalled();
  });

  // ----------- LẤY THEO ID -----------
  it('Phải trả về một danh mục theo ID', async () => {
    const result = {
      id: 1,
      code: 'A',
      name: 'DanhMucA',
      description: '',
      sortOrder: 1,
    };
    mockCategoryService.findOne.mockResolvedValue(result);

    expect(await controller.findOne(1)).toBe(result);
    expect(mockCategoryService.findOne).toHaveBeenCalledWith(1);
  });

  // ----------- TẠO MỚI -----------
  it('Phải tạo được danh mục mới', async () => {
    const dto: CreateCategoryDto = {
      code: 'B',
      name: 'DanhMucB',
      description: '',
      sortOrder: 2,
    };
    mockCategoryService.create.mockResolvedValue({ id: 2, ...dto });

    expect(await controller.create(dto)).toEqual({ id: 2, ...dto });
    expect(mockCategoryService.create).toHaveBeenCalledWith(dto);
  });

  // ----------- CẬP NHẬT -----------
  it('Phải cập nhật được danh mục', async () => {
    const dto: UpdateCategoryDto = { name: 'DanhMucDaCapNhat' };
    mockCategoryService.update.mockResolvedValue({
      id: 1,
      code: 'A',
      name: 'DanhMucDaCapNhat',
      description: '',
      sortOrder: 1,
    });

    expect(await controller.update(1, dto)).toEqual({
      id: 1,
      code: 'A',
      name: 'DanhMucDaCapNhat',
      description: '',
      sortOrder: 1,
    });
    expect(mockCategoryService.update).toHaveBeenCalledWith(1, dto);
  });

  // ----------- XOÁ -----------
  it('Phải xoá được danh mục', async () => {
    mockCategoryService.delete.mockResolvedValue({ deleted: true });

    expect(await controller.delete(1)).toEqual({ deleted: true });
    expect(mockCategoryService.delete).toHaveBeenCalledWith(1);
  });
});
