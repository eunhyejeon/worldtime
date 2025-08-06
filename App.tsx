import { useState, useEffect, useCallback } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { TimezoneSelector } from "./components/TimezoneSelector";
import { WorldClock } from "./components/WorldClock";
import {
  PixelGlobeIcon,
  SpinningPixelGlobeIcon,
} from "./components/PixelGlobeIcon";

import { useFarcaster } from "./hooks/useFarcaster";
import {
  timezoneService,
  type SavedTimezone,
} from "./services/timezoneService";
import {
  Save,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  Share2,
  Settings,
  Clock,
  Check,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { sdk } from "@farcaster/miniapp-sdk";

// Import pixel art images for component usage
import pixelGlobeImage from 'figma:asset/e605a7de666dfd2d1fbac1d6d0fec918525e3513.png';
import heroImage from 'figma:asset/9c076c1bf5b0cff2470493ba9fe9d079c618e69f.png';
import screenshotImage from 'figma:asset/ce09d6d720cb67092568aa6b2153d9094a653651.png';

// Helper function to get timezone label from timezone value
function getTimezoneLabel(timezone: string): string {
  const city = timezone.split('/').pop()?.replace('_', ' ') || timezone;
  
  // Common timezone mappings
  const labelMap: Record<string, string> = {
    'Asia/Seoul': 'Seoul (KST)',
    'America/New_York': 'New York (EST/EDT)',
    'Europe/London': 'London (GMT/BST)',
    'Asia/Tokyo': 'Tokyo (JST)',
    'America/Los_Angeles': 'Los Angeles (PST/PDT)',
    'Europe/Paris': 'Paris (CET/CEST)',
    'Asia/Shanghai': 'Shanghai (CST)',
    'Australia/Sydney': 'Sydney (AEST/AEDT)',
    'America/Chicago': 'Chicago (CST/CDT)',
    'Europe/Berlin': 'Berlin (CET/CEST)',
  };
  
  return labelMap[timezone] || `${city} (${timezone.split('/')[0]})`;
}

export default function App() {
  const { isReady, error: farcasterError } = useFarcaster();
  const [selectedTimezones, setSelectedTimezones] = useState<
    SavedTimezone[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [context, setContext] = useState<any>(null);
  const [userId] = useState(
    () => `user_${Math.random().toString(36).substr(2, 9)}`,
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTimezones, setLastSavedTimezones] = useState<SavedTimezone[]>([]);

  const [activeTab, setActiveTab] = useState("live");

  // Get timezones from URL parameters
  const getTimezonesFromURL = useCallback((): SavedTimezone[] => {
    const urlParams = new URLSearchParams(window.location.search);
    const timezones: SavedTimezone[] = [];
    
    // Check for tz1, tz2, tz3 parameters
    for (let i = 1; i <= 3; i++) {
      const tz = urlParams.get(`tz${i}`);
      if (tz) {
        timezones.push({
          timezone: tz,
          label: getTimezoneLabel(tz)
        });
      }
    }
    
    // Also check for comma-separated 'timezones' parameter
    const tzParam = urlParams.get('timezones');
    if (tzParam && timezones.length === 0) {
      const tzList = tzParam.split(',').filter(Boolean);
      tzList.forEach(tz => {
        timezones.push({
          timezone: tz.trim(),
          label: getTimezoneLabel(tz.trim())
        });
      });
    }
    
    return timezones;
  }, []);

  // Update URL when timezones change
  const updateURL = useCallback((timezones: SavedTimezone[]) => {
    const url = new URL(window.location.href);
    
    // Clear existing timezone parameters
    url.searchParams.delete('tz1');
    url.searchParams.delete('tz2');
    url.searchParams.delete('tz3');
    url.searchParams.delete('timezones');
    
    // Set new parameters (up to 3 timezones)
    timezones.slice(0, 3).forEach((tz, index) => {
      url.searchParams.set(`tz${index + 1}`, tz.timezone);
    });
    
    // Update URL without refreshing the page
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Check if timezones have changed
  const checkForChanges = useCallback((current: SavedTimezone[], saved: SavedTimezone[]) => {
    if (current.length !== saved.length) return true;
    return current.some((tz, index) => 
      tz.timezone !== saved[index]?.timezone || tz.label !== saved[index]?.label
    );
  }, []);

  // Share URL functionality - matches frame metadata
  const shareURL = useCallback(async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'World Time - anywhere, anytime',
          text: 'Know the time anywhere, anytime.',
          url: url,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled sharing
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy URL:', error);
        toast.error('Failed to copy URL');
      }
    }
  }, []);

  // Only set dynamic document title - meta tags are in index.html
  useEffect(() => {
    document.title = "World Time - anywhere, anytime";
  }, []);

  // Get Farcaster context for safe area and capabilities
  useEffect(() => {
    if (isReady && sdk.context) {
      setContext(sdk.context);

      // Call ready when the app is fully initialized
      const initializeApp = async () => {
        try {
          await loadUserTimezones();
          await sdk.actions.ready();
        } catch (error) {
          console.error("Failed to initialize app:", error);
          await sdk.actions.ready(); // Still call ready even if loading fails
        }
      };

      initializeApp();
    }
  }, [isReady]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored");
      // Retry loading if we were offline
      if (selectedTimezones.length === 0) {
        loadUserTimezones();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("No internet connection");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [selectedTimezones.length]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = checkForChanges(selectedTimezones, lastSavedTimezones);
    setHasUnsavedChanges(hasChanges);
  }, [selectedTimezones, lastSavedTimezones, checkForChanges]);

  // Check for haptic capability
  const supportsHaptics = context?.features?.haptics;

  const triggerHaptic = useCallback(
    async (
      type:
        | "light"
        | "medium"
        | "heavy"
        | "success"
        | "error"
        | "selection",
    ) => {
      if (!supportsHaptics) return;

      try {
        if (type === "success" || type === "error") {
          await sdk.haptics.notificationOccurred(type);
        } else if (type === "selection") {
          await sdk.haptics.selectionChanged();
        } else {
          await sdk.haptics.impactOccurred(type);
        }
      } catch (error) {
        console.log("Haptic feedback failed:", error);
      }
    },
    [supportsHaptics],
  );

  const loadUserTimezones = async () => {
    try {
      setLoading(true);
      
      // First check URL parameters
      const urlTimezones = getTimezonesFromURL();
      if (urlTimezones.length > 0) {
        setSelectedTimezones(urlTimezones);
        setLastSavedTimezones(urlTimezones);
        // Save URL timezones to localStorage for future visits
        await timezoneService.saveUserTimezones(userId, urlTimezones);
        setLoading(false);
        return;
      }

      // Fallback to saved timezones
      const timezones = await timezoneService.getUserTimezones(userId);
      setSelectedTimezones(timezones);
      setLastSavedTimezones(timezones);

      // Add some default timezones if none exist
      if (timezones.length === 0) {
        const defaultTimezones: SavedTimezone[] = [
          {
            timezone: "Asia/Seoul",
            label: "Seoul (KST)",
          },
          {
            timezone: "America/New_York",
            label: "New York (EST/EDT)",
          },
          {
            timezone: "Europe/London", 
            label: "London (GMT/BST)",
          },
        ];
        setSelectedTimezones(defaultTimezones);
        setLastSavedTimezones(defaultTimezones);
      }
    } catch (error) {
      console.error("Error loading user timezones:", error);
      
      // Fallback to default timezones
      const defaultTimezones: SavedTimezone[] = [
        {
          timezone: "Asia/Seoul",
          label: "Seoul (KST)",
        },
        {
          timezone: "America/New_York",
          label: "New York (EST/EDT)",
        },
        {
          timezone: "Europe/London",
          label: "London (GMT/BST)",
        },
      ];
      setSelectedTimezones(defaultTimezones);
      setLastSavedTimezones(defaultTimezones);
    } finally {
      setLoading(false);
    }
  };

  const saveUserTimezones = async () => {
    try {
      setSaving(true);
      await triggerHaptic("light");
      await timezoneService.saveUserTimezones(
        userId,
        selectedTimezones,
      );
      
      // Update URL when saving
      updateURL(selectedTimezones);
      setLastSavedTimezones([...selectedTimezones]);
      
      await triggerHaptic("success");
      toast.success("Time zones saved!");
      
      // Auto-switch to Live tab after saving
      setActiveTab("live");
    } catch (error) {
      console.error("Error saving user timezones:", error);
      await triggerHaptic("success"); // Still give success haptic since localStorage worked
      toast.success("Time zones saved locally!"); // Changed to success since localStorage save is sufficient
      
      // Still update URL even if server save fails
      updateURL(selectedTimezones);
      setLastSavedTimezones([...selectedTimezones]);
      
      // Auto-switch to Live tab after saving
      setActiveTab("live");
    } finally {
      setSaving(false);
    }
  };

  const handleTimezonesChange = useCallback(
    (timezones: SavedTimezone[]) => {
      setSelectedTimezones(timezones);
      updateURL(timezones); // Update URL immediately when timezones change
      triggerHaptic("selection");
    },
    [triggerHaptic, updateURL],
  );

  const handleRefresh = useCallback(async () => {
    await triggerHaptic("light");
    await loadUserTimezones();
  }, [triggerHaptic]);

  // Calculate safe area styles
  const safeAreaStyles = context?.client?.safeAreaInsets
    ? {
        paddingTop: Math.max(
          16,
          context.client.safeAreaInsets.top,
        ),
        paddingBottom: Math.max(
          16,
          context.client.safeAreaInsets.bottom,
        ),
        paddingLeft: Math.max(
          16,
          context.client.safeAreaInsets.left,
        ),
        paddingRight: Math.max(
          16,
          context.client.safeAreaInsets.right,
        ),
      }
    : { padding: 16 };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-brand-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/95 backdrop-blur">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <PixelGlobeIcon 
                size={96}
                animate={true}
                className="mx-auto animate-pulse"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-brand-text-primary">
              Initializing World Time
            </h2>
            <p className="text-gray-600 mb-4">
              Know the time anywhere, anytime...
            </p>
            {farcasterError && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">
                    {farcasterError}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gradient">
      <Toaster />
      <div
        className="container mx-auto max-w-2xl"
        style={safeAreaStyles}
      >
        {/* Connection Status */}
        {!isOnline && (
          <Card className="mb-4 border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">
                  No Internet Connection
                </p>
                <p className="text-red-600 text-sm">
                  Using local mode - times calculated in browser
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header - Perfectly matches frame metadata */}
        <Card className="mb-4 border-0 shadow-lg bg-white/95 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PixelGlobeIcon size={48} />
                <div>
                  <CardTitle className="text-xl text-brand-text-primary">
                    World Time
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    anywhere, anytime
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={shareURL}
                  variant="ghost"
                  size="sm"
                  className="p-3 text-brand-accent hover:text-brand-accent hover:bg-brand-light transition-colors"
                  title="Share this clock configuration"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
                {isOnline && (
                  <Button
                    onClick={handleRefresh}
                    variant="ghost"
                    size="sm"
                    className="p-3 text-brand-primary hover:text-brand-accent hover:bg-brand-light transition-colors"
                    disabled={loading}
                    aria-label="Refresh data"
                  >
                    <RefreshCw
                      className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {loading ? (
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <SpinningPixelGlobeIcon size={64} className="mx-auto" />
              </div>
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-brand-light rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-brand-light rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-brand-light rounded w-2/3 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative">
                {/* 2개 탭 메뉴 */}
                <TabsList className="grid w-full grid-cols-2 p-1 mb-6 bg-brand-light/50 rounded-xl">
                  <TabsTrigger 
                    value="live" 
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-gray-600 transition-all duration-200 data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-brand-subtle"
                  >
                    <Clock className="w-4 h-4" />
                    Live
                  </TabsTrigger>
                  <TabsTrigger 
                    value="manage"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-gray-600 transition-all duration-200 data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-brand-subtle relative"
                  >
                    <Settings className="w-4 h-4" />
                    Manage
                    {hasUnsavedChanges && (
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Quick Save Indicator */}
                {hasUnsavedChanges && activeTab === "live" && (
                  <div className="absolute top-1 right-4 flex items-center gap-2 text-xs text-brand-text-primary bg-brand-light px-3 py-1.5 rounded-full shadow-sm">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    Unsaved changes
                  </div>
                )}
              </div>

              <TabsContent value="live" className="mt-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-brand-text-primary">
                      <PixelGlobeIcon size={24} />
                      Live World Clocks
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isOnline ? (
                        <Wifi
                          className="w-4 h-4 text-green-600"
                          aria-label="Connected"
                        />
                      ) : (
                        <WifiOff
                          className="w-4 h-4 text-red-600"
                          aria-label="Offline"
                        />
                      )}
                      <span className="text-sm text-gray-500">
                        {selectedTimezones.length} zone
                        {selectedTimezones.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {selectedTimezones.length === 0 ? (
                    <div className="text-center py-8">
                      <PixelGlobeIcon size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-gray-500 mb-4">No time zones selected</p>
                      <Button
                        onClick={() => setActiveTab("manage")}
                        className="bg-brand-primary hover:bg-brand-accent text-white transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Add Time Zones
                      </Button>
                    </div>
                  ) : (
                    <WorldClock
                      timezones={selectedTimezones}
                      isOnline={isOnline}
                      onHapticFeedback={triggerHaptic}
                    />
                  )}
                </CardContent>
              </TabsContent>

              <TabsContent value="manage" className="mt-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-brand-text-primary">
                      <PixelGlobeIcon size={24} />
                      Manage Time Zones
                    </CardTitle>
                    {!hasUnsavedChanges && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <Check className="w-4 h-4" />
                        Saved
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <TimezoneSelector
                    selectedTimezones={selectedTimezones}
                    onTimezonesChange={handleTimezonesChange}
                    onHapticFeedback={triggerHaptic}
                  />
                  
                  {/* Enhanced Save button */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      {hasUnsavedChanges ? "You have unsaved changes" : "All changes saved"}
                    </div>
                    <Button
                      onClick={saveUserTimezones}
                      disabled={saving || !hasUnsavedChanges}
                      className={`${
                        hasUnsavedChanges 
                          ? "bg-brand-primary hover:bg-brand-accent" 
                          : "bg-green-400 hover:bg-green-500"
                      } text-white disabled:opacity-50 min-w-[140px] transition-colors`}
                      aria-label="Save timezone preferences"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : hasUnsavedChanges ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save & View Live
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Saved
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
}