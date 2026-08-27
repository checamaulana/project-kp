import { useForm, usePage } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';

export function YearToggle() {
    const { active_year } = usePage<{ active_year: number }>().props;
    const { post } = useForm();

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <Select
            value={String(active_year)}
            onValueChange={(value) => post(route('session.set-year'), { year: value })}
        >
            <SelectTrigger className="h-8 w-24">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                        {y}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
