"use client"

import { useState } from "react"
import { IconPlus, IconUsers } from "@tabler/icons-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { teamRoleLabels, type TeamMember } from "@/hooks/settings/types"

import { InviteMemberDialog } from "./invite-member-dialog"
import type { InviteMemberFormValues } from "./invite-member-dialog"
import { SettingsStateShell } from "./settings-state-shell"
import { SettingsSuccessAlert } from "./settings-success-alert"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  )
}

type TeamMembersTabProps = {
  members: TeamMember[] | null
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  isEmpty?: boolean
  onRetry?: () => void
}

export function TeamMembersTab({
  members,
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
}: TeamMembersTabProps) {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [showInviteSuccess, setShowInviteSuccess] = useState(false)

  const handleInvite = (values: InviteMemberFormValues) => {
    // TODO: Connect mutation — POST /api/settings/team-members/invite
    void values
    setShowInviteSuccess(true)
    window.setTimeout(() => setShowInviteSuccess(false), 4000)
  }

  return (
    <>
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="flex flex-col gap-1">
            <CardTitle>Team members</CardTitle>
            <CardDescription>
              Manage who can access and manage your business dashboard.
            </CardDescription>
          </div>
          <Button
            size="sm"
            className="shrink-0"
            onClick={() => setInviteOpen(true)}
          >
            <IconPlus />
            Invite member
          </Button>
        </CardHeader>
        <CardContent>
          {showInviteSuccess ? (
            <div className="mb-4">
              <SettingsSuccessAlert message="Invitation sent successfully." />
            </div>
          ) : null}

          <SettingsStateShell
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={onRetry}
            loadingContent={<ListSkeleton />}
          >
            {isEmpty ? (
              <Empty className="border py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconUsers />
                  </EmptyMedia>
                  <EmptyTitle>No team members</EmptyTitle>
                  <EmptyDescription>
                    Invite colleagues to help manage reservations and settings.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button size="sm" onClick={() => setInviteOpen(true)}>
                    <IconPlus />
                    Invite member
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <ul className="flex flex-col gap-4">
                {members?.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar>
                        {member.avatarUrl ? (
                          <AvatarImage
                            src={member.avatarUrl}
                            alt={member.name}
                          />
                        ) : null}
                        <AvatarFallback>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{member.name}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 capitalize">
                      {teamRoleLabels[member.role]}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </SettingsStateShell>
        </CardContent>
      </Card>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSubmit={handleInvite}
      />
    </>
  )
}
