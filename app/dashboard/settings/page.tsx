"use client";

import { useState } from "react";
import { Save, RefreshCw, Upload, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeCard } from "@/components/dashboard/settings/mode-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/components/language-provider";

// ─── Cards from General Tab (genel) ──────────────────────────────────────────

function LanguageCard() {
  const { t, locale, setLocale, locales } = useLanguage();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold leading-none">{t("settings.language")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.languageDesc")}</p>
          </div>
          <Select value={locale} onValueChange={(val: any) => setLocale(val)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locales.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  <span className="flex items-center gap-2 text-base">{l.flag} <span className="text-sm">{l.label}</span></span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Cards from Models Tab (modeller) ─────────────────────────────────────────

function AIProviderCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.aiProvider")}</CardTitle>
        <CardDescription>{t("settings.aiProviderDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("settings.openaiKey")}</Label>
            <div className="flex gap-2">
              <Input type="password" placeholder="sk-..." defaultValue="sk-demo-key-12345" />
              <Button>{t("common.save")}</Button>
            </div>
            <p className="text-xs text-muted-foreground">{t("settings.apiKeyLocal")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Cards from Account Tab (hesap) ───────────────────────────────────────────

function ProfileImageCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.profileImage")}</CardTitle>
        <CardDescription>{t("settings.profileImageDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-20 w-20 shrink-0 border">
              <AvatarFallback className="text-xl font-medium bg-muted">AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 flex-1">
              <p className="text-xs text-muted-foreground">{t("settings.supportedFormats")}</p>
              <p className="text-xs text-muted-foreground">{t("settings.maxFileSize")}</p>
              <p className="text-xs text-muted-foreground">{t("settings.imageResizeInfo")}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 w-full sm:w-auto sm:shrink-0">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Upload className="mr-2 size-4" /> {t("common.upload")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AccountInfoCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.accountInfo")}</CardTitle>
        <CardDescription>{t("settings.accountInfoDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="fullName">{t("settings.fullName")}</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input id="fullName" defaultValue="admin" />
              <Button className="w-full sm:w-auto"><Save className="mr-2 size-4" /> {t("common.save")}</Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t("settings.emailAddress")}</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input id="email" type="email" defaultValue="admin@sonix.app" />
              <Button className="w-full sm:w-auto"><Save className="mr-2 size-4" /> {t("common.update")}</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChangePasswordCard() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.changePassword")}</CardTitle>
        <CardDescription>{t("settings.changePasswordDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 max-w-sm">
          <div className="grid gap-2">
            <Label>{t("settings.currentPassword")}</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid gap-2">
            <Label>{t("settings.newPassword")}</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid gap-2">
            <Label>{t("settings.newPasswordConfirm")}</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-fit mt-2">{t("settings.updatePassword")}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DangerZoneCard() {
  const { t } = useLanguage();
  return (
    <Card className="border-destructive/20 mt-4">
      <CardHeader>
        <CardTitle className="text-destructive">{t("settings.dangerZone")}</CardTitle>
        <CardDescription>{t("settings.dangerZoneDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive">{t("settings.deleteAccountPermanent")}</Button>
      </CardContent>
    </Card>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("general");
  const { t } = useLanguage();

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-1 flex-col gap-6 pb-24">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("settings.title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("settings.title")} / {t("settings.general")}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl w-full flex flex-col gap-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full max-w-4xl mb-4 h-12 justify-start px-2 bg-muted/50 rounded-lg">
              <TabsTrigger value="general" className="px-6 data-[state=active]:shadow-none">{t("settings.general")}</TabsTrigger>
              <TabsTrigger value="models" className="px-6 data-[state=active]:shadow-none">{t("settings.models")}</TabsTrigger>
              <TabsTrigger value="account" className="px-6 data-[state=active]:shadow-none">{t("settings.account")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="grid gap-6">
                <LanguageCard />
                <ModeCard />
              </div>
            </TabsContent>
            
            <TabsContent value="models">
              <div className="grid gap-6">
                <AIProviderCard />
              </div>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="grid gap-6">
                <ProfileImageCard />
                <AccountInfoCard />
                <ChangePasswordCard />
                <Separator />
                <DangerZoneCard />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ScrollArea>
  );
}
