'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultilanguageUrl } from '@/types/admin';

interface MultilanguageUrlInputProps {
  label: string;
  value: MultilanguageUrl;
  onChange: (value: MultilanguageUrl) => void;
  placeholder?: string;
  required?: boolean;
}

export function MultilanguageUrlInput({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
}: MultilanguageUrlInputProps) {
  const handleChange = (lang: 'uz' | 'ru' | 'en', url: string) => {
    onChange({
      ...value,
      [lang]: url,
    });
  };

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Tabs defaultValue="uz" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="uz">UZ</TabsTrigger>
          <TabsTrigger value="ru">RU</TabsTrigger>
          <TabsTrigger value="en">EN</TabsTrigger>
        </TabsList>
        <TabsContent value="uz" className="mt-2">
          <Input
            type="url"
            value={value.uz}
            onChange={(e) => handleChange('uz', e.target.value)}
            placeholder={placeholder ? `${placeholder} (UZ)` : 'URL (UZ)'}
            required={required}
          />
        </TabsContent>
        <TabsContent value="ru" className="mt-2">
          <Input
            type="url"
            value={value.ru}
            onChange={(e) => handleChange('ru', e.target.value)}
            placeholder={placeholder ? `${placeholder} (RU)` : 'URL (RU)'}
            required={required}
          />
        </TabsContent>
        <TabsContent value="en" className="mt-2">
          <Input
            type="url"
            value={value.en}
            onChange={(e) => handleChange('en', e.target.value)}
            placeholder={placeholder ? `${placeholder} (EN)` : 'URL (EN)'}
            required={required}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

