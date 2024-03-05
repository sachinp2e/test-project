import { RootState } from '../store';
import { CategoryStateType } from '@/Lib/category/category.slice';

export const getAllCategorySelector = (state: RootState) => state.category as CategoryStateType;
