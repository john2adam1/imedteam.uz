'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultilanguageText } from '@/types/admin';

interface MultilanguageInputProps {
  label: string;
  value: MultilanguageText;
  onChange: (value: MultilanguageText) => void;
  placeholder?: string;
  required?: boolean;
}

export function MultilanguageInput({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
}: MultilanguageInputProps) {
  const handleChange = (lang: 'uz' | 'ru' | 'en', text: string) => {
    onChange({
      ...value,
      [lang]: text,
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
            value={value.uz}
            onChange={(e) => handleChange('uz', e.target.value)}
            placeholder={placeholder ? `${placeholder} (UZ)` : 'Uzbek'}
            required={required}
          />
        </TabsContent>
        <TabsContent value="ru" className="mt-2">
          <Input
            value={value.ru}
            onChange={(e) => handleChange('ru', e.target.value)}
            placeholder={placeholder ? `${placeholder} (RU)` : 'Russian'}
            required={required}
          />
        </TabsContent>
        <TabsContent value="en" className="mt-2">
          <Input
            value={value.en}
            onChange={(e) => handleChange('en', e.target.value)}
            placeholder={placeholder ? `${placeholder} (EN)` : 'English'}
            required={required}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

