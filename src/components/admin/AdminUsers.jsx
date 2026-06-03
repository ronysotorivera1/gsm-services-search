import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Mail, Loader2, UserCheck } from 'lucide-react';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState('');
  const [role, setRole] = useState('user');
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date', 100),
  });

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage('');
    setInviting(true);
    
    try {
      await base44.users.inviteUser(inviteEmail, role);
      setMessage(`✓ Invitación enviada a ${inviteEmail}`);
      setInviteEmail('');
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`✗ Error: ${err.message}`);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Formulario de invitación */}
      <div className="border border-border rounded-lg p-6 bg-card/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <UserCheck className="w-4 h-4" />
          Invitar nuevo usuario
        </h3>
        
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground">Correo electrónico</Label>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Rol</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-9 mt-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="user">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {message && (
            <div className={`text-sm p-3 rounded-lg ${message.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <Button type="submit" disabled={inviting || !inviteEmail}>
            {inviting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Invitar Usuario
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Lista de usuarios */}
      <div className="border border-border rounded-lg p-6 bg-card/50">
        <h3 className="font-semibold mb-4">Usuarios del sistema ({users.length})</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay usuarios aún</p>
        ) : (
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{u.full_name || u.email}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {u.role}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}