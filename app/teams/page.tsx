'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Mail, UserX, Shield, Crown, Eye, UserPlus, Settings, Copy } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  members: TeamMember[];
}

interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const [newTeam, setNewTeam] = useState({
    name: '',
    slug: '',
  });

  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'MEMBER',
  });

  useEffect(() => {
    fetchTeams();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams || []);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      });

      if (response.ok) {
        const data = await response.json();
        setTeams([...teams, data.team]);
        setShowCreateDialog(false);
        setNewTeam({ name: '', slug: '' });
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleInviteMember = async () => {
    if (!selectedTeam) return;

    try {
      const response = await fetch(`/api/teams/${selectedTeam.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteData),
      });

      if (response.ok) {
        alert('Invitation sent successfully');
        setShowInviteDialog(false);
        setInviteData({ email: '', role: 'MEMBER' });
        fetchTeams();
      }
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        const response = await fetch(`/api/teams/${teamId}/members/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchTeams();
        }
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  const handleUpdateRole = async (teamId: string, userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchTeams();
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      OWNER: { label: 'Owner', variant: 'default' as const, icon: Crown },
      ADMIN: { label: 'Admin', variant: 'secondary' as const, icon: Shield },
      MEMBER: { label: 'Member', variant: 'outline' as const, icon: Users },
      VIEWER: { label: 'Viewer', variant: 'outline' as const, icon: Eye },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.MEMBER;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your teams and collaborate with others</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>

        {teams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No teams yet</h3>
              <p className="text-gray-500 mb-4">Create your first team to start collaborating</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {teams.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{team.name}</CardTitle>
                      <CardDescription>
                        {team.members.length} member{team.members.length !== 1 ? 's' : ''} • Created {new Date(team.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTeam(team);
                          setShowInviteDialog(true);
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Invite
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {member.user.name?.[0] || member.user.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{member.user.name || member.user.email}</div>
                            <div className="text-sm text-gray-500">{member.user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(member.role)}
                          {member.userId !== currentUser?.id && member.role !== 'OWNER' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(team.id, member.userId)}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Team Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a team to collaborate with others on LeakJar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={newTeam.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    setNewTeam({ name, slug });
                  }}
                  placeholder="Acme Corporation"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="teamSlug">Team URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">leakjar.com/teams/</span>
                  <Input
                    id="teamSlug"
                    value={newTeam.slug}
                    onChange={(e) => setNewTeam({ ...newTeam, slug: e.target.value })}
                    placeholder="acme-corp"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam} disabled={!newTeam.name || !newTeam.slug}>
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Invite Member Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Invite someone to join {selectedTeam?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="inviteEmail">Email Address</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="colleague@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="inviteRole">Role</Label>
                <Select
                  value={inviteData.role}
                  onValueChange={(value) => setInviteData({ ...inviteData, role: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin - Can manage team and members</SelectItem>
                    <SelectItem value="MEMBER">Member - Can access team resources</SelectItem>
                    <SelectItem value="VIEWER">Viewer - Read-only access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteMember} disabled={!inviteData.email}>
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}