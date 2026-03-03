import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedAdminLayout from '@/layouts/admin/layout';
import { TeamDetail } from '@/types/teamOverviews';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserType } from '@/types/user';

interface Props {
  team: TeamDetail;
}

const TeamDetailPage: React.FC<Props> = ({ team }) => {
  const { user } = usePage<{ user: { data: UserType } }>().props;
  const auth = user.data;
  const [selectedStatus, setSelectedStatus] = useState<string>(team.status);
  const [isProcessing, setIsProcessing] = useState(false);

  // State untuk dialog edit
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    team_name: team.name,
    status: team.status as 'pending' | 'verified' | 'rejected',
    slot_type: team.slot_type || (team.game === 'Free Fire' ? 'single' : ''),
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(team.logo);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(team.payment_proof || null);

  // State untuk dialog hapus
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Terverifikasi</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Ditolak</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ketua':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Ketua</Badge>;
      case 'anggota':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Anggota</Badge>;
      case 'cadangan':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Cadangan</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const updateStatus = async () => {
    if (selectedStatus === team.status) {
      toast.error('Status tidak berubah');
      return;
    }
    
    if (confirm(`Anda akan mengubah status tim dari "${team.status}" menjadi "${selectedStatus}". Apakah Anda yakin ingin melanjutkan?`)) {
      setIsProcessing(true);
      try {
        await axios.put(`/secure-admin-essega/teams/${team.game === 'Mobile Legends' ? 'ml' : 'ff'}/${team.id}/status`, {
          status: selectedStatus
        });
        
        toast.success('Status tim berhasil diperbarui');
        // Refresh halaman untuk mendapatkan data terbaru
        router.reload();
      } catch (error) {
        console.error('Error updating team status:', error);
        toast.error('Gagal memperbarui status tim');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Fungsi untuk menyimpan perubahan edit
  const handleSaveEdit = async () => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('team_name', editForm.team_name);
      formData.append('status', editForm.status);
      
      if (team.game === 'Mobile Legends' && editForm.slot_type) {
        formData.append('slot_type', editForm.slot_type);
      }
      
      if (logoFile) {
        formData.append('team_logo', logoFile);
      }
      
      if (paymentFile) {
        formData.append('proof_of_payment', paymentFile);
      }
      
      const response = await axios.post(
        `/api/teams/${team.game === 'Mobile Legends' ? 'ml' : 'ff'}/${team.id}?_method=PUT`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Data tim berhasil diperbarui');
        setIsEditDialogOpen(false);
        
        // Refresh halaman untuk mendapatkan data terbaru
        router.reload();
      } else {
        throw new Error(response.data.message || 'Gagal memperbarui data tim');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui data tim');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler untuk file logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handler untuk file bukti pembayaran
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi untuk menghapus tim
  const handleDeleteTeam = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/teams/${team.game === 'Mobile Legends' ? 'ml' : 'ff'}/${team.id}`);
      
      toast.success(`Tim ${team.name} berhasil dihapus beserta semua pemainnya.`);
      setIsDeleteDialogOpen(false);
      
      // Cek apakah ada informasi redirect dari backend
      if (response.data.redirect) {
        // Redirect ke halaman yang ditentukan oleh backend
        const redirect = response.data.redirect;
        const url = redirect.path + 
          (redirect.params ? '?' + new URLSearchParams(redirect.params).toString() : '');
        
        // Delay sedikit untuk memastikan toast message terlihat
        setTimeout(() => {
          window.location.href = url;
        }, 1000);
      } else {
        // Jika tidak ada redirect, gunakan default redirect ke halaman tim
        router.visit('/secure-admin-essega/players');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Gagal menghapus tim');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AuthenticatedAdminLayout user={auth} title={`Detail Tim - ${team.name}`} headerTitle="Detail Tim">
      <Head title={`IT-ESEGA 2025 Official Website | Detail Tim - ${team.name}`} />
      
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="text-gray-500">{team.game}</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.visit('/secure-admin-essega/players')}
            >
              Kembali
            </Button>

            <Button 
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Tim
            </Button>
            
            <Button 
              variant="default"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Tim
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.open(`/secure-admin-essega/export/${team.game === 'Mobile Legends' ? 'MLplayers' : 'FFplayers'}`, '_blank')}
            >
              Export Data Pemain
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tim Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Informasi Tim</CardTitle>
              <CardDescription>Detail informasi tim {team.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={team.logo} />
                  <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(team.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal Daftar</p>
                  <p className="font-medium">{team.created_at}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Jumlah Pemain</p>
                  <p className="font-medium">{team.players.length}</p>
                </div>
                
                {team.slot_type && (
                  <div>
                    <p className="text-sm text-gray-500">Jenis Slot</p>
                    <p className="font-medium capitalize">{team.slot_type === 'single' ? 'Single Slot' : 'Double Slot'}</p>
                  </div>
                )}
                
                {team.slot_count && (
                  <div>
                    <p className="text-sm text-gray-500">Jumlah Slot</p>
                    <p className="font-medium">{team.slot_count}</p>
                  </div>
                )}
              </div>
              
              {team.payment_proof && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Bukti Pembayaran</p>
                  <img 
                    src={team.payment_proof} 
                    alt="Bukti Pembayaran" 
                    className="w-full h-auto max-h-64 object-contain border rounded-md"
                    onClick={() => window.open(team.payment_proof || '', '_blank')}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Ubah Status:</p>
                  <Select 
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="verified">Terverifikasi</SelectItem>
                      <SelectItem value="rejected">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="default" 
                  className="w-full" 
                  disabled={selectedStatus === team.status || isProcessing}
                  onClick={updateStatus}
                >
                  {isProcessing ? 'Memproses...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Daftar Pemain */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Daftar Pemain</CardTitle>
              <CardDescription>Anggota tim {team.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Daftar pemain tim {team.name}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Nickname</TableHead>
                    <TableHead>ID Server</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Dokumen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.players.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.nickname}</TableCell>
                      <TableCell>{player.id_server}</TableCell>
                      <TableCell>{getRoleBadge(player.role)}</TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <p>{player.no_hp}</p>
                          <p>{player.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {player.foto && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(player.foto || '', '_blank')}
                            >
                              Foto
                            </Button>
                          )}
                          {player.tanda_tangan && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(player.tanda_tangan || '', '_blank')}
                            >
                              TTD
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Edit Tim */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Tim</DialogTitle>
            <DialogDescription>
              Update informasi tim. Klik simpan saat selesai.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team_name">Nama Tim</Label>
              <Input
                id="team_name"
                value={editForm.team_name}
                onChange={(e) => setEditForm({...editForm, team_name: e.target.value})}
                placeholder="Nama tim"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({...editForm, status: value as 'pending' | 'verified' | 'rejected'})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="verified">Terverifikasi</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {team.game === 'Mobile Legends' && (
              <div className="space-y-2">
                <Label htmlFor="slot_type">Jenis Slot</Label>
                <Select
                  value={editForm.slot_type}
                  onValueChange={(value) => setEditForm({...editForm, slot_type: value})}
                >
                  <SelectTrigger id="slot_type">
                    <SelectValue placeholder="Pilih jenis slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Slot</SelectItem>
                    <SelectItem value="double">Double Slot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="team_logo">Logo Tim</Label>
              <div className="grid grid-cols-[1fr_120px] gap-4">
                <Input
                  id="team_logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                {logoPreview && (
                  <div className="h-[80px] w-[80px] rounded-md overflow-hidden">
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Format: JPG, PNG. Ukuran maksimal: 2MB
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proof_of_payment">Bukti Pembayaran</Label>
              <div className="grid grid-cols-[1fr_120px] gap-4">
                <Input
                  id="proof_of_payment"
                  type="file"
                  accept="image/*"
                  onChange={handlePaymentChange}
                />
                {paymentPreview && (
                  <div className="h-[80px] w-[80px] rounded-md overflow-hidden">
                    <img 
                      src={paymentPreview} 
                      alt="Payment Preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Format: JPG, PNG. Ukuran maksimal: 2MB
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isProcessing}
            >
              Batal
            </Button>
            <Button 
              type="button" 
              onClick={handleSaveEdit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border-red-500">
          <DialogHeader>
            <DialogTitle className="text-center">Hapus Tim</DialogTitle>
            <DialogDescription className="text-center">
              Apakah Anda yakin ingin menghapus tim ini?<br />
              <span className="font-semibold">{team.name}</span>
              <p className="text-red-500 mt-2 text-sm">Semua pemain yang terkait dengan tim ini juga akan dihapus.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
              disabled={isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthenticatedAdminLayout>
  );
};

export default TeamDetailPage; 