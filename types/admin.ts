// Admin Panel Types - Backend DTOs with multilanguage support

export type LanguageCode = 'uz' | 'ru' | 'en';

export interface MultilanguageText {
  uz: string;
  ru: string;
  en: string;
}

export interface MultilanguageUrl {
  uz: string;
  ru: string;
  en: string;
}

// Subject (Category) DTOs
export interface SubjectCreateDTO {
  image_url: string;
  order_num: number;
  name: MultilanguageText;
}

export interface SubjectUpdateDTO extends Partial<SubjectCreateDTO> {}

export interface Subject extends SubjectCreateDTO {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Course DTOs
export interface CourseCreateDTO {
  subject_id: string;
  teacher_id: string;
  image_url: string;
  is_public: boolean;
  order_num: number;
  price: MultilanguageText;
  name: MultilanguageText;
  description: MultilanguageText;
}

export interface CourseUpdateDTO extends Partial<CourseCreateDTO> {}

export interface Course extends CourseCreateDTO {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Module DTOs
export interface ModuleCreateDTO {
  course_id: string;
  order_num: number;
  name: MultilanguageText;
}

export interface ModuleUpdateDTO extends Partial<ModuleCreateDTO> {}

export interface Module extends ModuleCreateDTO {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Lesson DTOs
export type LessonType = 'video' | 'pdf' | 'test' | 'mixed';

export interface LessonCreateDTO {
  module_id: string;
  duration: number;
  order_num: number;
  type: LessonType;
  name: MultilanguageText;
}

export interface LessonUpdateDTO extends Partial<LessonCreateDTO> {}

export interface Lesson extends LessonCreateDTO {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Source DTOs
export type SourceType = 'video' | 'pdf' | 'test';

export interface SourceCreateDTO {
  lesson_id: string;
  order_num: number;
  type: SourceType;
  name: MultilanguageText;
  url: MultilanguageUrl;
}

export interface SourceUpdateDTO extends Partial<SourceCreateDTO> {}

export interface Source extends SourceCreateDTO {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Banner DTOs
export interface BannerCreateDTO {
  image_url: MultilanguageUrl;
  title: MultilanguageText;
  description: MultilanguageText;
  link_url: string;
  order_num: number;
}

export interface BannerUpdateDTO extends Partial<BannerCreateDTO> {}

export interface Banner extends BannerCreateDTO {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// Teacher DTO (for selects)
export interface Teacher {
  id: string;
  name: string;
  email?: string;
}

