import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AuthenticatedAdminLayout from '@/layouts/admin/layout';
import { UserType } from '@/types/user';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Edit2, PlusCircle, Terminal, Trash2, ExternalLink, Trophy } from 'lucide-react';
import * as React from 'react';

interface Bracket {
    id: number;
    game_name: string;
    stage_name: string;
    group_name: string | null;
    bracket_url: string;
    is_active: boolean;
    order_position: number;
}

export default function BracketManagementPage() {
    const { props } = usePage<any>();
    const user = props.user?.data || props.user;
    const brackets = Array.isArray(props.brackets) ? props.brackets : [];
    const flash = props.flash || {};

    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingBracket, setEditingBracket] = React.useState<Bracket | null>(null);
    const [isManualStage, setIsManualStage] = React.useState(false);

    // Ambil daftar Stage Name yang unik dari data yang sudah ada (pastikan string)
    const existingStages = Array.from(new Set(brackets.map((b: Bracket) => b.stage_name || ""))).filter(Boolean);
    const commonStages = ["Qualification Day 1", "Qualification Day 2", "Playoffs", "Grand Final"];
    const allStageSuggestions = Array.from(new Set([...commonStages, ...existingStages] as string[]));

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        game_name: '',
        stage_name: '',
        group_name: '',
        bracket_url: '',
        order_position: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore - route is global from Ziggy
        const url = editingBracket ? route('admin.brackets.update', editingBracket.id) : route('admin.brackets.store');
        
        if (editingBracket) {
            put(url, {
                onSuccess: () => {
                    setIsFormOpen(false);
                    setEditingBracket(null);
                    setIsManualStage(false);
                    reset();
                },
            });
        } else {
            post(url, {
                onSuccess: () => {
                    setIsFormOpen(false);
                    setIsManualStage(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this bracket?')) {
            // @ts-ignore
            destroy(route('admin.brackets.destroy', id));
        }
    };

    const openEditForm = (bracket: Bracket) => {
        setEditingBracket(bracket);
        setData({
            game_name: bracket.game_name || '',
            stage_name: bracket.stage_name || '',
            group_name: bracket.group_name || '',
            bracket_url: bracket.bracket_url || '',
            order_position: bracket.order_position || 0,
            is_active: !!bracket.is_active,
        });
        
        if (bracket.stage_name && !allStageSuggestions.includes(bracket.stage_name)) {
            setIsManualStage(true);
        } else {
            setIsManualStage(false);
        }
        setIsFormOpen(true);
    };

    const openAddForm = () => {
        setEditingBracket(null);
        setIsManualStage(false);
        reset();
        setIsFormOpen(true);
    };

    return (
        <AuthenticatedAdminLayout title="Bracket Management" headerTitle="Bracket Management" user={user}>
            <Head title="Admin | Bracket Management" />
            
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Bracket Management</h1>
                        <p className="text-gray-400">Manage tournament brackets and external links dynamically.</p>
                    </div>
                    <Button onClick={openAddForm} className="bg-red-600 hover:bg-red-700">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Bracket
                    </Button>
                </header>

                {flash.success && (
                    <Alert className="mb-6 bg-green-900/20 border-green-900 text-green-400">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle>Active Brackets</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-zinc-800 hover:bg-transparent">
                                            <TableHead className="text-gray-400 w-[50px]">#</TableHead>
                                            <TableHead className="text-gray-400">Game</TableHead>
                                            <TableHead className="text-gray-400">Stage/Group</TableHead>
                                            <TableHead className="text-gray-400 text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {brackets.length > 0 ? (
                                            brackets.map((bracket: Bracket) => (
                                                <TableRow key={bracket.id} className="border-zinc-800">
                                                    <TableCell className="text-zinc-600 font-mono text-xs">
                                                        {bracket.order_position}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${bracket.game_name === 'ML' ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-orange-900/30 text-orange-400 border border-orange-800'}`}>
                                                            {bracket.game_name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{bracket.stage_name}</div>
                                                        {bracket.group_name && <div className="text-[10px] uppercase tracking-wider text-gray-500">Group {bracket.group_name}</div>}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <a href={bracket.bracket_url} target="_blank" rel="noreferrer">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-zinc-800">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </Button>
                                                            </a>
                                                            <Button onClick={() => openEditForm(bracket)} variant="ghost" size="icon" className="h-8 w-8 text-teal-400 hover:text-teal-300 hover:bg-teal-900/20">
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button onClick={() => handleDelete(bracket.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-12 text-gray-500 italic">
                                                    No brackets found. Click "Add New Bracket" to start.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        {isFormOpen && (
                            <Card className="bg-zinc-900 border-zinc-800 sticky top-8 shadow-2xl shadow-red-900/5">
                                <CardHeader className="border-b border-zinc-800 mb-4">
                                    <CardTitle className="text-lg">{editingBracket ? 'Edit Bracket' : 'Add New Bracket'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="game_name" className="text-xs uppercase text-gray-500 font-bold">Game</Label>
                                            <Select 
                                                value={data.game_name || ""} 
                                                onValueChange={(val) => setData('game_name', val)}
                                            >
                                                <SelectTrigger className="bg-zinc-950 border-zinc-800 h-11">
                                                    <SelectValue placeholder="Select Game" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                                                    <SelectItem value="ML">Mobile Legends</SelectItem>
                                                    <SelectItem value="FF">Free Fire</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.game_name && <p className="text-[10px] text-red-500">{errors.game_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label htmlFor="stage_name" className="text-xs uppercase text-gray-500 font-bold">Stage Name</Label>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setIsManualStage(!isManualStage)}
                                                    className="text-[10px] text-red-500 hover:underline"
                                                >
                                                    {isManualStage ? "Switch to Dropdown" : "Type Manually"}
                                                </button>
                                            </div>
                                            
                                            {isManualStage ? (
                                                <Input 
                                                    id="stage_name" 
                                                    value={data.stage_name} 
                                                    onChange={e => setData('stage_name', e.target.value)} 
                                                    placeholder="e.g. Qualification Day 1" 
                                                    className="bg-zinc-950 border-zinc-800 h-11"
                                                />
                                            ) : (
                                                <Select 
                                                    value={data.stage_name || ""} 
                                                    onValueChange={(val) => setData('stage_name', val)}
                                                >
                                                    <SelectTrigger className="bg-zinc-950 border-zinc-800 h-11 text-left">
                                                        <SelectValue placeholder="Pick a stage" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                                                        {allStageSuggestions.map(stage => (
                                                            <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                                        ))}
                                                        {allStageSuggestions.length === 0 && <p className="p-2 text-xs text-gray-500">No previous stages found.</p>}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            {errors.stage_name && <p className="text-[10px] text-red-500">{errors.stage_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="group_name" className="text-xs uppercase text-gray-500 font-bold">Group Name (Optional)</Label>
                                            <Input 
                                                id="group_name" 
                                                value={data.group_name} 
                                                onChange={e => setData('group_name', e.target.value)} 
                                                placeholder="e.g. A" 
                                                className="bg-zinc-950 border-zinc-800 h-11"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bracket_url" className="text-xs uppercase text-gray-500 font-bold">Challonge/Spreadsheet URL</Label>
                                            <Input 
                                                id="bracket_url" 
                                                value={data.bracket_url} 
                                                onChange={e => setData('bracket_url', e.target.value)} 
                                                placeholder="https://challonge.com/..." 
                                                className="bg-zinc-950 border-zinc-800 h-11"
                                            />
                                            {errors.bracket_url && <p className="text-[10px] text-red-500">{errors.bracket_url}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="order_position" className="text-xs uppercase text-gray-500 font-bold">Display Order</Label>
                                            <Input 
                                                id="order_position" 
                                                type="number" 
                                                value={data.order_position} 
                                                onChange={e => setData('order_position', parseInt(e.target.value) || 0)} 
                                                className="bg-zinc-950 border-zinc-800 h-11"
                                            />
                                            <p className="text-[10px] text-gray-500 italic">Smaller numbers show up first in the website.</p>
                                        </div>

                                        <div className="flex gap-3 pt-6">
                                            <Button type="submit" disabled={processing} className="flex-1 bg-red-600 hover:bg-red-700 h-11 font-bold">
                                                {editingBracket ? 'UPDATE BRACKET' : 'SAVE BRACKET'}
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="flex-1 border-zinc-800 hover:bg-zinc-900 h-11">
                                                CANCEL
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        {!isFormOpen && (
                            <div className="rounded-xl border-2 border-dashed border-zinc-800 p-12 text-center bg-zinc-900/20">
                                <Trophy className="h-12 w-12 text-zinc-800 mx-auto mb-4" />
                                <p className="text-gray-500 text-sm font-medium">Select a bracket to edit or add a new one to manage links.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedAdminLayout>
    );
}


