import "@/App.css";
import { useEffect } from "react";
import { GameProvider, useGame } from "@/game/GameContext";
import { unlockAudio, setAudioEnabled, startMusic, playSfx } from "@/game/audio";
import NavBar from "@/components/NavBar";
import LoginScreen from "@/screens/LoginScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import HeroSelectScreen from "@/screens/HeroSelectScreen";
import MainMenu from "@/screens/MainMenu";
import WorldMap from "@/screens/WorldMap";
import ChapterScreen from "@/screens/ChapterScreen";
import BattleScreen from "@/screens/BattleScreen";
import CharacterScreen from "@/screens/CharacterScreen";
import InventoryScreen from "@/screens/InventoryScreen";
import ShopScreen from "@/screens/ShopScreen";
import QuestScreen from "@/screens/QuestScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { VictoryScreen, DefeatScreen, ChapterCompleteScreen, GameCompleteScreen } from "@/screens/ResultScreens";

const NAV_SCREENS = ["menu", "map", "chapter", "character", "inventory", "shop", "quests", "settings"];

function AudioController() {
  const { screen, profile, currentBattle } = useGame();
  const music = profile ? profile.settings.music : true;
  const sound = profile ? profile.settings.sound : true;

  useEffect(() => {
    const unlock = () => unlockAudio();
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);
    const click = (e) => { if (e.target.closest("button")) playSfx("click"); };
    document.addEventListener("click", click);
    return () => { document.removeEventListener("pointerdown", unlock); document.removeEventListener("keydown", unlock); document.removeEventListener("click", click); };
  }, []);

  useEffect(() => { setAudioEnabled({ music, sound }); }, [music, sound]);

  useEffect(() => {
    const track = screen === "battle" ? (currentBattle?.level === 5 ? "boss" : "battle") : "menu";
    startMusic(track);
  }, [screen, currentBattle]);

  return null;
}

function Router() {
  const { screen } = useGame();
  const showNav = NAV_SCREENS.includes(screen);

  let content;
  switch (screen) {
    case "loading": content = <LoadingScreen />; break;
    case "login": content = <LoginScreen />; break;
    case "heroSelect": content = <HeroSelectScreen />; break;
    case "menu": content = <MainMenu />; break;
    case "map": content = <WorldMap />; break;
    case "chapter": content = <ChapterScreen />; break;
    case "battle": content = <BattleScreen />; break;
    case "character": content = <CharacterScreen />; break;
    case "inventory": content = <InventoryScreen />; break;
    case "shop": content = <ShopScreen />; break;
    case "quests": content = <QuestScreen />; break;
    case "settings": content = <SettingsScreen />; break;
    case "victory": content = <VictoryScreen />; break;
    case "defeat": content = <DefeatScreen />; break;
    case "chapterComplete": content = <ChapterCompleteScreen />; break;
    case "gameComplete": content = <GameCompleteScreen />; break;
    default: content = <LoginScreen />;
  }

  return (
    <div className="vl-app min-h-screen text-slate-100 flex flex-col relative overflow-x-hidden">
      <div className="vl-bg-vignette" aria-hidden />
      {showNav && <NavBar />}
      <div className="relative flex-1 flex flex-col">{content}</div>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AudioController />
      <Router />
    </GameProvider>
  );
}

export default App;
