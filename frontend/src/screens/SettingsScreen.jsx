import React from "react";
import { useGame } from "@/game/GameContext";
import { Panel, GoldButton } from "@/components/common";
import { Switch } from "@/components/ui/switch";
import { Music, Volume2, Sparkles, Vibrate, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TOGGLES = [
  { key: "music", label: "Background Music", desc: "Ambient fantasy music", icon: Music },
  { key: "sound", label: "Sound Effects", desc: "Combat and UI sounds", icon: Volume2 },
  { key: "animations", label: "Animations", desc: "Attack, skill and VFX motion", icon: Sparkles },
  { key: "screenShake", label: "Screen Shake", desc: "Camera shake on big hits", icon: Vibrate },
];

export default function SettingsScreen() {
  const { profile, updateSettings, resetSave } = useGame();

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-6 py-6">
      <h1 className="vl-heading text-3xl sm:text-4xl mb-5">Settings</h1>

      <Panel className="p-5 vl-fade-up divide-y divide-slate-700/40">
        {TOGGLES.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center">
                  <Icon size={18} className="text-amber-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">{t.label}</div>
                  <div className="text-xs text-slate-400">{t.desc}</div>
                </div>
              </div>
              <Switch
                data-testid={`settings-toggle-${t.key}`}
                checked={profile.settings[t.key]}
                onCheckedChange={(v) => updateSettings({ [t.key]: v })}
              />
            </div>
          );
        })}
      </Panel>

      <Panel className="p-5 mt-5 border-rose-500/30 vl-fade-up">
        <h3 className="font-cinzel text-rose-300 font-bold mb-1">Danger Zone</h3>
        <p className="text-xs text-slate-400 mb-4">Reset your save to wipe all progress and start a new legend from scratch.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <GoldButton variant="danger" data-testid="settings-reset-btn"><Trash2 size={16} /> Reset Save</GoldButton>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-slate-900 border border-rose-500/40 text-slate-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-cinzel text-rose-300">Erase your legend?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">This permanently deletes all progress, level, gear and coins. This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700">Cancel</AlertDialogCancel>
              <AlertDialogAction data-testid="settings-confirm-reset-btn" onClick={resetSave} className="bg-rose-600 hover:bg-rose-700 text-white">Erase forever</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Panel>

      <p className="text-center text-[11px] text-slate-500 mt-6">Village Legends · a single-player browser RPG. All progress is saved locally in your browser.</p>
    </div>
  );
}
