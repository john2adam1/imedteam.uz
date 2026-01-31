'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { MultilanguageText } from '@/types/admin';
import { cn } from '@/lib/utils';

interface MultilanguageTextareaProps {
  label: string;
  value: MultilanguageText;
  onChange: (value: MultilanguageText) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function MultilanguageTextarea({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  rows = 4,
  className,
}: MultilanguageTextareaProps) {
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
          <textarea
            value={value.uz}
            onChange={(e) => handleChange('uz', e.target.value)}
            placeholder={placeholder ? `${placeholder} (UZ)` : 'Uzbek'}
            required={required}
            rows={rows}
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
          />
        </TabsContent>
        <TabsContent value="ru" className="mt-2">
          <textarea
            value={value.ru}
            onChange={(e) => handleChange('ru', e.target.value)}
            placeholder={placeholder ? `${placeholder} (RU)` : 'Russian'}
            required={required}
            rows={rows}
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
          />
        </TabsContent>
        <TabsContent value="en" className="mt-2">
          <textarea
            value={value.en}
            onChange={(e) => handleChange('en', e.target.value)}
            placeholder={placeholder ? `${placeholder} (EN)` : 'English'}
            required={required}
            rows={rows}
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

