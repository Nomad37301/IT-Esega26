import AuthenticatedAdminLayout from '@/layouts/admin/layout';
import { Head, usePage } from '@inertiajs/react';
import { TeamsTable } from '@/components/admin/TeamsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserType } from '@/types/user';

export default function TeamManagement() {
    const { user } = usePage<{
        user: { data: UserType };
        flash: { success?: string; error?: string };
    }>().props;
    const auth = user.data;

    return (
        <AuthenticatedAdminLayout title="Team Management" headerTitle="Team Management" user={auth}>
            <Head title="Admin | Team Management" />
            
            <div className="container py-8">
                <h1 className="text-2xl font-bold mb-6">Tim Management</h1>
                
                <Tabs defaultValue="free-fire">
                    <TabsList className="w-full max-w-md mb-6">
                        <TabsTrigger value="free-fire" className="flex-1">
                            <div className="flex items-center gap-2">
                                <img src="/Images/FF-logo.png" alt="Free Fire" className="w-5 h-5" />
                                <span>Free Fire</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="mobile-legends" className="flex-1">
                            <div className="flex items-center gap-2">
                                <img src="/Images/ML-logo.png" alt="Mobile Legends" className="w-5 h-5" />
                                <span>Mobile Legends</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="free-fire">
                        <TeamsTable gameType="free-fire" />
                    </TabsContent>
                    
                    <TabsContent value="mobile-legends">
                        <TeamsTable gameType="mobile-legends" />
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedAdminLayout>
    );
} 