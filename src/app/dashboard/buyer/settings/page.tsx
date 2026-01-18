'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from 'sonner'
import { User, Lock, Bell, Loader2, Star, Phone, Shield, Eye, Mail, Key, Smartphone, Laptop, Download, Trash2, MessageSquare, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { FileUpload } from '@/components/ui/file-upload'
import { cn } from '@/lib/utils'

function BuyerSettingsContent() {
    const supabase = createClient()
    const searchParams = useSearchParams()
    const activeTab = searchParams.get('tab') || 'profile'

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)

    // Form States
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        bio: '',
        phone: '',
        second_contact: '',
        city: '',
        avatar_url: ''
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    // Privacy Settings (Matches Mockup: Personalized, Marketing, Third-Party)
    const [privacySettings, setPrivacySettings] = useState({
        publicProfile: true, // Legacy
        showCity: true,      // Legacy
        personalized_recommendations: true,
        marketing_communications: false,
        third_party_sharing: true
    })

    // Communication Settings (Matches Mockup: Push, Order, Marketing, Email, Mobile)
    const [commSettings, setCommSettings] = useState({
        // Legacy
        emailOrderUpdates: true,
        emailMarketing: false,
        // New Granular
        push_notifications: false,
        order_updates: true,
        marketing_drops: false,
        newsletter: true,
        sms_alerts: false,
        whatsapp_support: true
    })

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    setProfileData({
                        first_name: profile.first_name || user.user_metadata?.full_name || '',
                        last_name: profile.last_name || '',
                        email: user.email || '',
                        bio: profile.bio || '',
                        phone: profile.phone || '',
                        second_contact: profile.second_contact || '',
                        city: profile.city || '',
                        avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || ''
                    })
                    // Populate privacy/comm settings from DB if available
                    if (profile.privacy_settings) {
                        setPrivacySettings(prev => ({ ...prev, ...profile.privacy_settings }))
                    }
                    if (profile.notification_preferences) {
                        setCommSettings(prev => ({ ...prev, ...profile.notification_preferences }))
                    }
                } else {
                    setProfileData(prev => ({
                        ...prev,
                        first_name: user.user_metadata?.full_name || '',
                        email: user.email || ''
                    }))
                }
            }
            setLoading(false)
        }
        fetchProfile()
    }, [])

    const handleUpdateProfile = async () => {
        setSaving(true)
        try {
            if (!user) return

            // Sync Auth
            await supabase.auth.updateUser({
                data: { full_name: profileData.first_name, avatar_url: profileData.avatar_url }
            })

            // Upsert Profile
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    first_name: profileData.first_name,
                    last_name: profileData.last_name,
                    bio: profileData.bio,
                    phone: profileData.phone,
                    second_contact: profileData.second_contact,
                    city: profileData.city,
                    avatar_url: profileData.avatar_url,
                    email: user.email,
                    updated_at: new Date().toISOString(),
                    // Include settings to prevent overwrite if triggered here
                    privacy_settings: privacySettings,
                    notification_preferences: commSettings
                })

            if (error) throw error
            toast.success('Profile updated successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setSaving(true)
        const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword })
        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Password changed successfully")
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        }
        setSaving(false)
    }

    // Auto-save handler for toggles
    const updatePreference = async (type: 'privacy' | 'communications', key: string, value: boolean) => {
        // Optimistic update
        if (type === 'privacy') {
            setPrivacySettings(prev => ({ ...prev, [key]: value }))
        } else {
            setCommSettings(prev => ({ ...prev, [key]: value }))
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    [type === 'privacy' ? 'privacy_settings' : 'notification_preferences']:
                        type === 'privacy'
                            ? { ...privacySettings, [key]: value }
                            : { ...commSettings, [key]: value },
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error
            toast.success('Preference saved')
        } catch (error) {
            toast.error('Failed to save preference')
        }
    }

    if (loading) return <div className="p-8 text-zinc-500">Loading settings...</div>

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto text-white pb-32">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Account Settings</h1>
                    <p className="text-zinc-400">Manage your profile, security, and preferences.</p>
                </div>
                {/* Profile Shortcut for quick password change if needed, though redundant with tabs */}
            </div>

            <Tabs defaultValue={activeTab} className="space-y-8">
                <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-lg w-full md:w-auto overflow-x-auto flex justify-start">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-zinc-800 px-6">Profile & Contact</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-zinc-800 px-6">Account Security</TabsTrigger>
                    <TabsTrigger value="privacy" className="data-[state=active]:bg-zinc-800 px-6">Privacy & Data</TabsTrigger>
                    <TabsTrigger value="communications" className="data-[state=active]:bg-zinc-800 px-6">Communications</TabsTrigger>
                </TabsList>

                {/* 1. PROFILE TAB */}
                <TabsContent value="profile" className="space-y-8">
                    <div className="grid gap-6">
                        {/* Avatar */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-pink-500" /> Public Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 shadow-xl group">
                                        {profileData.avatar_url ? (
                                            <img src={profileData.avatar_url} alt="Profile" className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-zinc-500"><User className="h-10 w-10" /></div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FileUpload
                                                bucketName="avatars"
                                                folderName={user.id}
                                                label="avatar"
                                                aspectRatio={1}
                                                onUploadComplete={(url) => setProfileData(prev => ({ ...prev, avatar_url: url }))}
                                            >
                                                <div className="cursor-pointer text-xs text-white font-bold p-2 text-center">Change</div>
                                            </FileUpload>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{profileData.first_name || 'Anonymous User'}</h3>
                                        <div className="text-xs text-zinc-500">Recommended 500x500px</div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Display Name</Label>
                                        <Input
                                            value={profileData.first_name}
                                            onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input
                                            value={profileData.city}
                                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Bio</Label>
                                    <Textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        className="bg-zinc-950 border-zinc-800 min-h-[100px]"
                                        placeholder="Bit about yourself..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact */}
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5 text-blue-500" /> Private Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <Input value={profileData.email} disabled className="bg-zinc-950 border-zinc-800 text-zinc-500 cursor-not-allowed" />
                                        <p className="text-[10px] text-zinc-600">Contact support to change email.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800"
                                            placeholder="+52 55..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Second Contact</Label>
                                        <Input
                                            value={profileData.second_contact}
                                            onChange={(e) => setProfileData({ ...profileData, second_contact: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800"
                                            placeholder="Alternative Phone"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button onClick={handleUpdateProfile} disabled={saving} className="bg-white text-black hover:bg-zinc-200 w-full md:w-auto px-8 h-12 font-bold rounded-full">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Profile Changes"}
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* 2. SECURITY TAB (Matches Image 3) */}
                <TabsContent value="security" className="space-y-8">
                    <div className="max-w-3xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold italic tracking-tighter mb-1">ACCOUNT SECURITY</h2>
                            <p className="text-zinc-500">Manage your password and protect your account from unauthorized access.</p>
                        </div>

                        <Card className="bg-zinc-900 border-zinc-800 mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-pink-500"><Key className="h-5 w-5" /> CHANGE PASSWORD</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="uppercase text-xs font-bold text-zinc-500">Current Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••••••"
                                        className="bg-zinc-950 border-zinc-800"
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="uppercase text-xs font-bold text-zinc-500">New Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="••••••••••••••••"
                                            className="bg-zinc-950 border-zinc-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="uppercase text-xs font-bold text-zinc-500">Confirm New Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            placeholder="••••••••••••••••"
                                            className="bg-zinc-950 border-zinc-800"
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleChangePassword} disabled={saving} className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-8">
                                    {saving ? "Updating..." : "Update Password"}
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> TWO-FACTOR (2FA)</CardTitle>
                                    <CardDescription>Add an extra layer of security.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                                        <span className="text-zinc-500 font-bold text-sm">Status: <span className="text-red-500 italic">Inactive</span></span>
                                        <Switch disabled title="Coming soon via Supabase MFA" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Laptop className="h-5 w-5" /> ACTIVE SESSIONS</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Laptop className="h-8 w-8 text-zinc-600" />
                                            <div>
                                                <div className="font-bold text-sm">Chrome on macOS</div>
                                                <div className="text-[10px] text-zinc-500 uppercase">New York, USA • Active Now</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] px-2 py-1 bg-pink-500/10 text-pink-500 font-bold rounded">THIS DEVICE</div>
                                    </div>
                                    <div className="flex items-center justify-between opacity-50">
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="h-8 w-8 text-zinc-600" />
                                            <div>
                                                <div className="font-bold text-sm">iPhone 15 Pro</div>
                                                <div className="text-[10px] text-zinc-500 uppercase">Los Angeles, USA • 2 hours ago</div>
                                            </div>
                                        </div>
                                        <button className="text-[10px] font-bold hover:text-white uppercase">Log Out</button>
                                    </div>
                                    <Button variant="link" className="text-pink-500 text-xs p-0 h-auto w-full text-right mt-2">Sign out of all sessions</Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-8 p-4 border border-red-900/30 bg-red-950/10 rounded-lg flex gap-4 items-start">
                            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-sm text-white">Protecting your account</h4>
                                <p className="text-xs text-zinc-400 mt-1">Americana will never ask for your password or verification codes via email or SMS. If you notice suspicious activity, contact Support immediately.</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* 3. PRIVACY TAB (Matches Image 2) */}
                <TabsContent value="privacy" className="space-y-8">
                    <div className="max-w-3xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold tracking-tighter mb-1">Privacy & Data Management</h2>
                            <p className="text-zinc-500">Manage how your information is used and control your digital footprint.</p>
                        </div>

                        {/* Manage Permissions */}
                        <div className="mb-8">
                            <h3 className="flex items-center gap-2 font-bold text-pink-500 uppercase tracking-wider text-sm mb-4">
                                <Shield className="h-4 w-4" /> Manage Permissions
                            </h3>
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardContent className="p-0 divide-y divide-white/5">
                                    <div className="flex items-center justify-between p-6">
                                        <div>
                                            <div className="font-bold text-sm text-white">Personalized Recommendations</div>
                                            <div className="text-xs text-zinc-500">Allow us to suggest items based on your browsing history.</div>
                                        </div>
                                        <Switch
                                            checked={privacySettings.personalized_recommendations}
                                            onCheckedChange={(c) => updatePreference('privacy', 'personalized_recommendations', c)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-6">
                                        <div>
                                            <div className="font-bold text-sm text-white">Marketing Communications</div>
                                            <div className="text-xs text-zinc-500">Receive updates about new drops and exclusive events.</div>
                                        </div>
                                        <Switch
                                            checked={privacySettings.marketing_communications}
                                            onCheckedChange={(c) => updatePreference('privacy', 'marketing_communications', c)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-6">
                                        <div>
                                            <div className="font-bold text-sm text-white">Third-Party Data Sharing</div>
                                            <div className="text-xs text-zinc-500">Share limited data with our curated shipping partners.</div>
                                        </div>
                                        <Switch
                                            checked={privacySettings.third_party_sharing}
                                            onCheckedChange={(c) => updatePreference('privacy', 'third_party_sharing', c)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Download Data */}
                        <div className="mb-8">
                            <h3 className="flex items-center gap-2 font-bold text-pink-500 uppercase tracking-wider text-sm mb-4">
                                <Download className="h-4 w-4" /> Download Data Reports
                            </h3>
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-sm text-white">Request Your Personal Data</div>
                                        <div className="text-xs text-zinc-500">Download a comprehensive report of your account activity (JSON).</div>
                                    </div>
                                    <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white">
                                        <Download className="mr-2 h-4 w-4" /> Generate Report
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Delete Account */}
                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-red-500 uppercase tracking-wider text-sm mb-4">
                                <AlertTriangle className="h-4 w-4" /> Danger Zone
                            </h3>
                            <div className="border border-red-900/30 bg-red-950/10 p-8 rounded-lg text-center">
                                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                                <h4 className="font-bold text-white mb-2">Delete Account & Data</h4>
                                <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
                                    This action is permanent and cannot be undone. You will lose access to order history, wishlist, and reward points.
                                </p>
                                <Button variant="destructive" className="bg-red-900/50 border border-red-500 hover:bg-red-900 text-red-500 hover:text-white">
                                    REQUEST ACCOUNT DELETION
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* 4. COMMUNICATIONS TAB (Matches Image 1) */}
                <TabsContent value="communications" className="space-y-8">
                    <div className="max-w-3xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold tracking-tighter mb-1">Communication Preferences</h2>
                            <p className="text-zinc-500">Choose how you want to be reached for orders, security, and drops.</p>
                        </div>

                        {/* Push Notifications */}
                        <div className="mb-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="h-10 w-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                                        <Bell className="h-5 w-5 text-pink-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Push Notifications</CardTitle>
                                        <CardDescription>Direct alerts to your browser or device</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="divide-y divide-white/5 pt-4">
                                    <div className="flex items-center justify-between py-4">
                                        <div>
                                            <div className="font-bold text-sm text-white">Order Updates</div>
                                            <div className="text-xs text-zinc-500">Real-time status of your orders and tracking</div>
                                        </div>
                                        <Switch
                                            checked={commSettings.order_updates}
                                            onCheckedChange={(c) => updatePreference('communications', 'order_updates', c)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <div>
                                            <div className="font-bold text-sm text-white">Marketing & Drops</div>
                                            <div className="text-xs text-zinc-500">New arrivals, limited collections, and exclusive offers</div>
                                        </div>
                                        <Switch
                                            checked={commSettings.marketing_drops}
                                            onCheckedChange={(c) => updatePreference('communications', 'marketing_drops', c)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Email */}
                        <div className="mb-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Email Communication</CardTitle>
                                        <CardDescription>Detailed updates and curated lookbooks</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="divide-y divide-white/5 pt-4">
                                    <div className="flex items-center justify-between py-4">
                                        <div>
                                            <div className="font-bold text-sm text-white">Security & Account</div>
                                            <div className="text-xs text-zinc-500">Password changes and login alerts (Required)</div>
                                        </div>
                                        <Switch checked disabled />
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <div>
                                            <div className="font-bold text-sm text-white">Newsletter & Collections</div>
                                            <div className="text-xs text-zinc-500">Monthly style guides and designer highlights</div>
                                        </div>
                                        <Switch
                                            checked={commSettings.newsletter}
                                            onCheckedChange={(c) => updatePreference('communications', 'newsletter', c)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Mobile */}
                        <div className="mb-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                        <MessageSquare className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Mobile Messaging</CardTitle>
                                        <CardDescription>Fastest alerts for urgent updates</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="divide-y divide-white/5 pt-4">
                                    <div className="flex items-center justify-between py-4">
                                        <div>
                                            <div className="font-bold text-sm text-white">SMS Alerts</div>
                                            <div className="text-xs text-zinc-500">Order delivery codes and verification</div>
                                        </div>
                                        <Switch
                                            checked={commSettings.sms_alerts}
                                            onCheckedChange={(c) => updatePreference('communications', 'sms_alerts', c)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <div>
                                            <div className="font-bold text-sm text-white">WhatsApp Support</div>
                                            <div className="text-xs text-zinc-500">Direct line to our concierge support team</div>
                                        </div>
                                        <Switch
                                            checked={commSettings.whatsapp_support}
                                            onCheckedChange={(c) => updatePreference('communications', 'whatsapp_support', c)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full border border-pink-500/50 flex items-center justify-center text-pink-500">i</div>
                                <span className="text-sm text-zinc-400">Changes are saved automatically.</span>
                            </div>
                            <Button className="bg-pink-600 hover:bg-pink-700 font-bold">Update All Preferences</Button>
                        </div>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    )
}

export default function BuyerSettingsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-zinc-500">Loading settings...</div>}>
            <BuyerSettingsContent />
        </Suspense>
    )
}

