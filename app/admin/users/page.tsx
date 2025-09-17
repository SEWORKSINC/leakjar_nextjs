'use client';

import React, { useState, useEffect } from 'react';
import { DynamicSidebarLayout } from '@/components/dynamic-sidebar-layout';
import { AdminRoute } from '@/components/AdminRoute';
import { Users, Shield, Mail, Calendar, Edit2, Trash2, UserPlus, Eye, X, Globe, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getSupabaseClient } from '@/lib/supabase-client';

interface Domain {
  id: string;
  domain: string;
  type: string;
  description?: string;
  companyName?: string;
  isVerified?: boolean;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  last_sign_in_at?: string;
  domains_count?: number;
  domains?: Domain[];
}

export default function UserManagementPage() {
  const [selectedMenu, setSelectedMenu] = useState('user-management');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string>('');
  const [selectedUserDomains, setSelectedUserDomains] = useState<{user: User | null, open: boolean}>({
    user: null,
    open: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseClient();

      // Get session for authentication
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.error('No session found');
        return;
      }

      // Fetch users with their profiles and domain counts
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('Authentication required');
        return;
      }

      // Check if trying to change own role
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser && currentUser.id === userId) {
        alert('You cannot change your own role');
        setEditingUserId(null);
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        await fetchUsers();
        setEditingUserId(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error updating user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleVerifyDomain = async (domainId: string, isVerified: boolean, userId?: string) => {
    if (!userId) return;

    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`/api/admin/domains/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ domainId, isVerified })
      });

      if (response.ok) {
        // Update modal data immediately if it's open
        if (selectedUserDomains.open && selectedUserDomains.user) {
          const updatedDomains = selectedUserDomains.user.domains?.map(d =>
            d.id === domainId ? { ...d, isVerified } : d
          ) || [];

          setSelectedUserDomains({
            ...selectedUserDomains,
            user: { ...selectedUserDomains.user, domains: updatedDomains }
          });
        }

        // Refresh background user data
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update domain status');
      }
    } catch (error) {
      console.error('Error updating domain status:', error);
      alert('Error updating domain status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString();
  };

  const getRoleBadgeColor = (role: string) => {
    return 'bg-gray-100 text-gray-800';
  };

  const openDomainModal = (user: User) => {
    setSelectedUserDomains({ user, open: true });
  };

  const closeDomainModal = () => {
    setSelectedUserDomains({ user: null, open: false });
  };

  return (
    <AdminRoute>
      <DynamicSidebarLayout
        activeItem={selectedMenu}
        onMenuSelect={setSelectedMenu}
      >
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-gray-600" />
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              </div>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Domains</TableHead>
                  <TableHead>Domain List</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {editingUserId === user.id ? (
                          <Select
                            value={editingRole}
                            onValueChange={(value) => {
                              setEditingRole(value);
                              handleRoleUpdate(user.id, value);
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USER">User</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{user.domains_count || 0}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDomainModal(user)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View ({user.domains_count || 0})
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {formatDate(user.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.last_sign_in_at || '')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              const supabase = getSupabaseClient();
                              const { data: { user: currentUser } } = await supabase.auth.getUser();
                              if (currentUser && currentUser.id === user.id) {
                                alert('You cannot change your own role');
                                return;
                              }
                              setEditingUserId(user.id);
                              setEditingRole(user.role);
                            }}
                            disabled={loading}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Total users: {filteredUsers.length}
          </div>
        </div>

        {/* Domain Modal */}
        <Dialog open={selectedUserDomains.open} onOpenChange={closeDomainModal}>
          <DialogContent className="sm:max-w-none max-w-[95vw] w-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domains for {selectedUserDomains.user?.email}
              </DialogTitle>
              <DialogDescription asChild>
                <div></div>
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {selectedUserDomains.user?.domains && selectedUserDomains.user.domains.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Domain</TableHead>
                        <TableHead className="whitespace-nowrap">Type</TableHead>
                        <TableHead className="whitespace-nowrap">Company</TableHead>
                        <TableHead className="whitespace-nowrap">Description</TableHead>
                        <TableHead className="whitespace-nowrap min-w-[180px]">Verification Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedUserDomains.user.domains.map((domain, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium whitespace-nowrap">{domain.domain}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {domain.type}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{domain.companyName || '-'}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{domain.description || '-'}</TableCell>
                          <TableCell>
                            <Select
                              value={domain.isVerified ? 'verified' : 'pending'}
                              onValueChange={(value) => {
                                handleVerifyDomain(domain.id, value === 'verified', selectedUserDomains.user?.id);
                              }}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">
                                  <div className="flex items-center gap-1">
                                    <XCircle className="h-4 w-4 text-yellow-600" />
                                    <span>Pending</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="verified">
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Verified</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No domains registered for this user</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </DynamicSidebarLayout>
    </AdminRoute>
  );
}