import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    const allBrackets = Array.isArray(props.brackets) ? props.brackets : [];
    const flash = props.flash || {};

    const [activeTab, setActiveTab] = React.useState('ML');
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingBracket, setEditingBracket] = React.useState<Bracket | null>(null);
    const [isManualStage, setIsManualStage] = React.useState(false);

    // Filter brackets for the current tab
    const filteredBrackets = allBrackets.filter((b: Bracket) => b.game_name === activeTab);

    // Smart Stage Suggestions filtered by game
    const existingStages = Array.from(new Set(filteredBrackets.map((b: Bracket) => b.stage_name || ""))).filter(Boolean);
    const commonStages = activeTab === 'ML' 
        ? ["Qualification Day 1", "Qualification Day 2", "Playoffs", "Grand Final"]
        : ["Group Stage", "Final Day"];
    const allStageSuggestions = Array.from(new Set([...commonStages, ...existingStages] as string[]));

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        game_name: activeTab,
        stage_name: '',
        group_name: '',
        bracket_url: '',
        order_position: 0,
        is_active: true,
    });

    // Keep game_name in sync with activeTab unless editing
    React.useEffect(() => {
        if (!editingBracket) {
            setData('game_name', activeTab);
        }
    }, [activeTab]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
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
        setData('game_name', activeTab);
        setIsFormOpen(true);
    };

    return (
        <AuthenticatedAdminLayout title="Bracket Management" headerTitle="Bracket Management" user={user}>
            <Head title="Admin | Bracket Management" />
            
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Bracket Management</h1>
                        <p className="text-zinc-400">Update tournament brackets for Mobile Legends and Free Fire.</p>
                    </div>
                    {/* CONFIRM ACTION (GREEN) */}
                    <Button onClick={openAddForm} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 shadow-lg shadow-emerald-900/20">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        ADD {activeTab} BRACKET
                    </Button>
                </header>

                {flash.success && (
                    <Alert className="mb-6 bg-emerald-950/20 border-emerald-900 text-emerald-400">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-zinc-900 border border-zinc-800 p-1 mb-8 h-12">
                        {/* Tab trigger will inherit red accent from base style */}
                        <TabsTrigger value="ML" className="data-[state=active]:text-white px-10 h-10 transition-all text-sm font-medium">
                            Mobile Legends
                        </TabsTrigger>
                        <TabsTrigger value="FF" className="data-[state=active]:text-white px-10 h-10 transition-all text-sm font-medium">
                            Free Fire
                        </TabsTrigger>
                    </TabsList>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* List Column */}
                        <div className="lg:col-span-2">
                            <Card className="bg-zinc-950 border-zinc-800 shadow-none">
                                <CardHeader className="border-b border-zinc-800 pb-4">
                                    <CardTitle className="text-zinc-100 text-base font-medium">
                                        {activeTab === 'ML' ? 'Mobile Legends' : 'Free Fire'} Brackets
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-zinc-800 hover:bg-transparent text-zinc-500 uppercase tracking-wider">
                                                <TableHead className="w-[60px] pl-6 font-mono text-[10px]">#</TableHead>
                                                <TableHead className="font-mono text-[10px]">Stage / Group</TableHead>
                                                <TableHead className="font-mono text-[10px] text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredBrackets.length > 0 ? (
                                                filteredBrackets.map((bracket: Bracket) => (
                                                    <TableRow key={bracket.id} className="border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                                                        <TableCell className="text-zinc-500 font-mono text-xs pl-6">
                                                            {bracket.order_position}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium text-zinc-100">{bracket.stage_name}</div>
                                                            {bracket.group_name && <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Group {bracket.group_name}</div>}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex justify-center gap-1">
                                                                <a href={bracket.bracket_url} target="_blank" rel="noreferrer">
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </Button>
                                                                </a>
                                                                <Button onClick={() => openEditForm(bracket)} variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                                {/* WARNING ACTION (RED) */}
                                                                <Button onClick={() => handleDelete(bracket.id)} variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-950/20">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-24 text-zinc-600 italic text-sm">
                                                        No {activeTab} brackets found in this stage.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-1">
                            {isFormOpen ? (
                                <Card className="bg-zinc-950 border-zinc-800 sticky top-8 shadow-xl border-t-zinc-800">
                                    <CardHeader className="border-b border-zinc-800 mb-6">
                                        <CardTitle className="text-base font-medium text-zinc-100">
                                            {editingBracket ? 'Modify' : 'Create'} {activeTab} Entry
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Category</Label>
                                                <div className="bg-zinc-900 border border-zinc-800 rounded-md h-10 flex items-center px-3 text-sm text-zinc-400 font-mono">
                                                    {activeTab === 'ML' ? 'MOBILE LEGENDS' : 'FREE FIRE'}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <Label htmlFor="stage_name" className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Stage Identifier</Label>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setIsManualStage(!isManualStage)}
                                                        className="text-[10px] text-zinc-500 hover:text-zinc-100 transition-colors underline underline-offset-2"
                                                    >
                                                        {isManualStage ? "Existing List" : "Manual Type"}
                                                    </button>
                                                </div>
                                                
                                                {isManualStage ? (
                                                    <Input 
                                                        id="stage_name" 
                                                        value={data.stage_name} 
                                                        onChange={e => setData('stage_name', e.target.value)} 
                                                        placeholder="e.g. Qualification Day 1" 
                                                        className="bg-zinc-900 border-zinc-800 h-10 text-zinc-100 placeholder:text-zinc-700"
                                                    />
                                                ) : (
                                                    <Select 
                                                        value={data.stage_name || ""} 
                                                        onValueChange={(val) => setData('stage_name', val)}
                                                    >
                                                        <SelectTrigger className="bg-zinc-900 border-zinc-800 h-10 text-left text-zinc-300">
                                                            <SelectValue placeholder="Select a stage..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                            {allStageSuggestions.map(stage => (
                                                                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                                {errors.stage_name && <p className="text-[10px] text-red-500 font-medium">{errors.stage_name}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="group_name" className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Group Label (Optional)</Label>
                                                <Input 
                                                    id="group_name" 
                                                    value={data.group_name} 
                                                    onChange={e => setData('group_name', e.target.value)} 
                                                    placeholder="e.g. A" 
                                                    className="bg-zinc-900 border-zinc-800 h-10 text-zinc-100"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bracket_url" className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Source Link (URL)</Label>
                                                <Input 
                                                    id="bracket_url" 
                                                    value={data.bracket_url} 
                                                    onChange={e => setData('bracket_url', e.target.value)} 
                                                    placeholder="https://..." 
                                                    className="bg-zinc-900 border-zinc-800 h-10 text-zinc-100"
                                                />
                                                {errors.bracket_url && <p className="text-[10px] text-red-500 font-medium">{errors.bracket_url}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="order_position" className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Display Order</Label>
                                                <Input 
                                                    id="order_position" 
                                                    type="number" 
                                                    value={data.order_position} 
                                                    onChange={e => setData('order_position', parseInt(e.target.value) || 0)} 
                                                    className="bg-zinc-900 border-zinc-800 h-10 text-zinc-100 font-mono"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-3 pt-6 border-t border-zinc-900">
                                                {/* CONFIRM ACTION (GREEN) */}
                                                <Button type="submit" disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/20">
                                                    {editingBracket ? 'COMMIT CHANGES' : 'PUBLISH ENTRY'}
                                                </Button>
                                                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="w-full text-zinc-500 hover:text-zinc-300 h-10 text-xs font-medium">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="rounded-xl border border-zinc-800 bg-zinc-900/5 p-16 text-center flex flex-col items-center">
                                    <Trophy className="h-10 w-10 text-zinc-800 mb-4 opacity-20" />
                                    <p className="text-zinc-600 text-xs font-medium max-w-[200px] leading-relaxed">
                                        Select an entry from the list or click the "Add" button to manage tournament brackets for {activeTab === 'ML' ? 'Mobile Legends' : 'Free Fire'}.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Tabs>
            </div>
        </AuthenticatedAdminLayout>
    );
}
