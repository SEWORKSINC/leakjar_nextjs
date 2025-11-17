'use client';

import { useState } from 'react';
import { useOrganization } from '@/components/providers/organization-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Building2,
  Plus,
  Settings,
  Users,
  ChevronsUpDown,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function OrganizationSwitcher() {
  const router = useRouter();
  const { currentOrganization, organizations, switchOrganization, loading } = useOrganization();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async (orgId: string) => {
    if (orgId === currentOrganization?.id) return;

    setIsSwitching(true);
    await switchOrganization(orgId);
    setIsSwitching(false);
  };

  const handleCreateNew = () => {
    router.push('/organizations/new');
  };

  const handleManageOrganization = () => {
    router.push('/organizations/settings');
  };

  const handleManageMembers = () => {
    router.push('/organizations/members');
  };

  if (loading) {
    return (
      <div className="h-10 w-48 bg-gray-100 animate-pulse rounded-lg"></div>
    );
  }

  if (!currentOrganization) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between min-w-[200px] hover:bg-gray-50"
          disabled={isSwitching}
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">{currentOrganization.name}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Organization List */}
        <div className="max-h-48 overflow-y-auto">
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleSwitch(org.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">{org.name}</span>
                </div>
                {org.id === currentOrganization.id && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        {/* Actions */}
        <DropdownMenuItem onClick={handleManageMembers} className="cursor-pointer">
          <Users className="h-4 w-4 mr-2" />
          Manage Members
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleManageOrganization} className="cursor-pointer">
          <Settings className="h-4 w-4 mr-2" />
          Organization Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCreateNew} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}