'use client';

import { useState, useEffect } from 'react';
import { DynamicSidebarLayout } from '@/components/dynamic-sidebar-layout';
import { useOrganization } from '@/components/providers/organization-provider';
import { OrganizationMember, OrganizationInvitation } from '@/lib/types/organization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Mail,
  Shield,
  Calendar,
  MoreVertical,
  UserPlus,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/providers/auth-provider';

export default function OrganizationMembersPage() {
  const { currentOrganization, currentMember } = useOrganization();
  const { session } = useAuth();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'admin' | 'viewer'>('member');
  const [inviting, setInviting] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isExistingInvite, setIsExistingInvite] = useState(false);

  // Check permissions
  const canManageMembers = currentMember?.role === 'owner' || currentMember?.role === 'admin';
  const isOwner = currentMember?.role === 'owner';

  useEffect(() => {
    if (currentOrganization && session) {
      fetchMembers();
      fetchInvitations();
    }
  }, [currentOrganization, session]);

  const fetchMembers = async () => {
    if (!currentOrganization || !session) return;

    try {
      const response = await fetch(`/api/organizations/${currentOrganization.id}/members`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    if (!currentOrganization || !session || !canManageMembers) return;

    try {
      const response = await fetch(`/api/organizations/${currentOrganization.id}/invitations`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const handleInvite = async () => {
    if (!currentOrganization || !session || !inviteEmail) return;

    setInviting(true);
    try {
      const response = await fetch(`/api/organizations/${currentOrganization.id}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Copy invitation link to clipboard
        navigator.clipboard.writeText(data.invitationLink);
        setCopiedLink(data.invitationLink);

        // Show different message for existing invitation
        if (data.existingInvitation) {
          setIsExistingInvite(true);
        } else {
          setIsExistingInvite(false);
        }

        // Refresh invitations list
        fetchInvitations();

        // Clear form
        setInviteEmail('');
        setInviteRole('member');

        // Close dialog after 3 seconds for existing invites, 2 seconds for new
        setTimeout(() => {
          setInviteDialogOpen(false);
          setCopiedLink(null);
          setIsExistingInvite(false);
        }, data.existingInvitation ? 3000 : 2000);
      } else {
        alert(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!session || !confirm('Are you sure you want to cancel this invitation?')) return;

    try {
      const response = await fetch(`/api/organizations/invitations?id=${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        fetchInvitations();
      }
    } catch (error) {
      console.error('Error canceling invitation:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!session || !currentOrganization) return;
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await fetch(`/api/organizations/${currentOrganization.id}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
      case 'canceled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <DynamicSidebarLayout
      activeItem="members"
      onMenuSelect={() => {}}
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">Organization Members</h1>
            </div>
            {canManageMembers && (
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite New Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join {currentOrganization?.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        type="email"
                        placeholder="colleague@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        disabled={inviting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
                      <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {isOwner && <SelectItem value="admin">Admin</SelectItem>}
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {copiedLink && (
                      <div className={`p-3 border rounded-lg ${isExistingInvite ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                        <div className={`flex items-center gap-2 text-sm ${isExistingInvite ? 'text-yellow-800' : 'text-green-800'}`}>
                          <Copy className="h-4 w-4" />
                          {isExistingInvite
                            ? 'This invitation was already sent. Link copied to clipboard again!'
                            : 'Invitation link copied to clipboard!'}
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={handleInvite}
                      disabled={!inviteEmail || inviting}
                      className="w-full"
                    >
                      {inviting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Invitation
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <p className="text-gray-500 mt-1">
            Manage team members and their permissions
          </p>
        </div>

        {/* Members Table */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Current Members</h2>
          <div className="bg-white border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  {canManageMembers && <TableHead className="w-12"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Loading members...
                    </TableCell>
                  </TableRow>
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No members yet
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {member.user?.email?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{member.user?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{member.user?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                          <Shield className="h-3 w-3" />
                          {member.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm ${member.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                          {member.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      {canManageMembers && (
                        <TableCell>
                          {member.role !== 'owner' && member.userId !== session?.user?.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Invitations Table */}
        {canManageMembers && invitations.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Pending Invitations</h2>
            <div className="bg-white border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invited</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {invitation.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(invitation.role)}`}>
                          {invitation.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invitation.status)}
                          <span className="text-sm">{invitation.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(invitation.invitedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(invitation.expiresAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {invitation.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelInvitation(invitation.id)}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </DynamicSidebarLayout>
  );
}