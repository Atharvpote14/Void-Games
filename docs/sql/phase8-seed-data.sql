-- ══════════════════════════════════════════════════════════════════════
-- VOID GAMES - PHASE 8 SEED DATA (OPTIONAL)
-- Run AFTER phase8-guides-fixes.sql to fill the pages with sample content.
-- Delete rows anytime:  delete from guides; delete from fix_articles;
-- ══════════════════════════════════════════════════════════════════════

insert into public.guides (title, slug, category, is_featured, author, content, created_at) values
(
  'The Ultimate PC Gaming Setup Guide',
  'ultimate-pc-gaming-setup-guide',
  'Beginners',
  true,
  'Void Games Team',
  $guide$Building the perfect gaming setup is about more than raw power. A great experience comes from balancing hardware, software, and comfort so every session feels smooth and responsive.

## Choose the right hardware

Your budget decides where to spend first. The graphics card matters most for resolution and detail, the CPU for frame consistency, and RAM for multitasking.

- GPU first: spend 40-50% of your budget here
- CPU second: pair it so neither part bottlenecks the other
- RAM: 16 GB is the minimum today, 32 GB is comfortable
- Storage: an NVMe SSD for games, an HDD only for archives

## Install games on the fast drive

Most launchers let you pick a folder. Always install the games you play often on your fastest SSD. Move old saves and screenshots elsewhere to keep the drive clean.

## Tune Windows for gaming

Disable the Xbox Game Bar overlay, switch your power plan to High Performance, and turn off fullscreen optimizations for problematic games. Each change is small, but together they reduce stutter and input lag.

## Optimize your graphics settings

Start from the game's preset and lower only what you cannot notice: shadows to high instead of ultra, motion blur off, and ambient occlusion to SSAO. Watch your frame time graph rather than the FPS counter alone.

## Keep drivers updated

Use the official driver tools from your GPU vendor and do a clean install when a major game update lands. A clean install removes leftover settings that can cause crashes.

## Maintain your PC

Dust filters, monthly cleanups, and a good cooling profile keep clocks stable. Thermal throttling is the silent killer of performance that no setting can fix.

Final tip: keep your desktop clean, close background apps with a launcher like MSI Afterburner, and test with built-in benchmarks before blaming your hardware.$guide$,
  now() - interval '12 days'
),
(
  'How to Boost FPS in Any Game',
  'how-to-boost-fps-any-game',
  'Performance',
  false,
  'Void Games Team',
  $guide$Frame rate problems usually come from a handful of repeatable causes. Work through this checklist in order and you will recover most of your lost FPS without spending money.

## Start with the obvious

Update your GPU driver, set the game to fullscreen (not borderless), and close browsers and overlays. Discord overlay alone can cost 5-10 FPS.

## Fix the render resolution

- Set resolution scale to 100% or lower in the game settings
- Check Windows display scaling is at 100%
- Make sure the monitor runs at its native refresh rate

## Tune the heavy settings

The biggest FPS killers are shadows, reflections, and anti-aliasing. Drop them one step at a time and watch the difference.

- Shadows: High is usually enough
- Reflections: off or low in fast-paced games
- Anti-aliasing: use TAA or DLSS/FSR instead of MSAA

## Check your temperatures

Download MSI Afterburner and watch GPU and CPU temps while playing. If anything passes 85C, airflow or a repaste is your fix, not a new GPU.

## Clean your background

Press Ctrl+Shift+Esc and close apps you are not using. A single browser tab on a heavy site can eat a full CPU core.

## Last resort: lower resolution

If nothing else works, run the game at 1080p with FSR or DLSS quality. The image stays sharp and the FPS jump is usually massive.$guide$,
  now() - interval '9 days'
),
(
  'Installing Games Without Issues',
  'installing-games-without-issues',
  'Installation',
  false,
  'Void Games Team',
  $guide$Most installation problems are caused by the same three mistakes: blocked antivirus, a wrong folder, or a corrupted download. This guide fixes all three before they waste your evening.

## Prepare the download

- Use a download manager for large files
- Keep the archive on a drive with at least double the game size free
- Close your antivirus or add the download folder to exceptions

## Extract the files correctly

Use 7-Zip or WinRAR and always extract to the SAME folder the archive is in. Extracting to the desktop or a cloud-synced folder breaks file permissions.

## Run the installer as admin

Right-click the setup file and choose Run as administrator. Install to a simple path like D:\Games\Title with no special characters.

## Enable the game in your antivirus

After installation, add the game folder to your antivirus exclusions. Real-time scanning is the number one cause of crashes right after a fresh install.

## First launch checklist

- Verify the folder contains the launcher exe
- Launch once to create config files
- Only then copy over your saves or mods

If the game still fails, delete the config folder inside the game directory and let the game rebuild it.$guide$,
  now() - interval '6 days'
),
(
  'Beginner''s Guide to Modding',
  'beginners-guide-to-modding',
  'Modding',
  false,
  'Void Games Team',
  $guide$Modding is the fastest way to make a game feel new again. You do not need to be a programmer, just careful with your folders and patient with load orders.

## Understand the basics

A mod is just a file or folder the game reads at startup. Mod managers keep track of these files so you can install and remove them safely.

- Mod managers: use Vortex for most games, the built-in manager for others
- Back up your saves before installing anything
- Read the mod page's requirements twice

## Install a mod manager first

Install Vortex or Mod Organizer 2 and point it at your game. It will create a mods folder and handle conflicts for you.

## Sort your load order

Load order decides which mod wins when two change the same file. Put big framework mods first, gameplay tweaks in the middle, and patches last.

## Test incrementally

Install one mod at a time and launch the game after each one. If something breaks, you know exactly which mod caused it instead of guessing.

## Remove mods the right way

Never delete mod files while the game is running. Disable the mod in the manager, close the game, then remove it.

Keep a screenshot of your working mod list. When an update breaks everything, you can rebuild it in minutes instead of hours.$guide$,
  now() - interval '5 days'
),
(
  'Best Graphics Settings for Competitive Games',
  'best-graphics-settings-competitive',
  'Settings',
  false,
  'Void Games Team',
  $guide$In competitive games, visibility beats beauty. These settings give you the clearest picture with the highest frame rate.

## The competitive preset

- Resolution: native, with DLSS/FSR off in shooters
- V-Sync: off
- Shadow quality: low or medium
- Anti-aliasing: off or FXAA
- Texture quality: high or ultra
- View distance: high
- Effects: low

## Brightness and crosshair

Raise brightness until dark corners are visible, then lower it two steps. Use a bright crosshair color that contrasts with your map.

## Monitor settings

Disable motion blur and film grain in the driver panel. If your monitor supports it, enable black equalizer and set response time to the fastest setting.

## Sound matters more than graphics

Keep the game's sound at full volume and Windows sounds at zero. Footstep audio tells you more than 4K textures ever will.

Remember: consistency beats quality. Pick settings you can keep across every map and mode.$guide$,
  now() - interval '3 days'
),
(
  'How to Fix Common Crashes Before You Reinstall',
  'how-to-fix-common-crashes-before-reinstall',
  'Crashes',
  false,
  'Void Games Team',
  $guide$Before you spend an hour reinstalling, work through this list. Most crashes are caused by small things you can fix in minutes.

## Check the crash log

Most games write a crash report to their save folder or Documents. Read the last lines and look for a missing DLL, a shader error, or an out-of-memory message.

## Update everything at once

Update your GPU driver, Windows, DirectX, and VC++ runtimes. Old runtimes are a classic cause of startup crashes.

## Fix corrupted files

Run the game launcher's verify/repair option. It re-downloads only the broken files and takes minutes.

## Try a clean config

Delete or rename the game's config folder. A corrupted setting file causes crashes that a fresh install also fixes by accident.

## Lower one setting

Set the game to its lowest preset and play for 10 minutes. If it stops crashing, the issue is GPU memory or an unstable overclock.

## Test your RAM

Run Windows Memory Diagnostic once. Faulty RAM causes random crashes in exactly one game more often than people expect.

If none of this helps, the game may need a specific Windows version or a community patch. Search the game's fix center on this site first.$guide$,
  now() - interval '1 day'
);

insert into public.fix_articles (title, slug, category, problem, symptoms, solution, created_at) values
(
  'Game Crashes on Launch After Update',
  'game-crashes-on-launch-after-update',
  'Crashes',
  $fx$The game crashes immediately after a new update, usually right after the splash screen.$fx$,
  $fx$Game shows splash logo then closes without an error message. Event Viewer shows a faulting module related to the game's exe.$fx$,
  $fx$1. Verify the game files through your launcher (Steam, Epic, or the game's own tool) to repair corrupted update files.
2. Delete the config folder in Documents and let the game recreate it on next launch.
3. Update your GPU driver and run a clean driver installation.
4. Disable all mods temporarily, then re-enable them one at a time.
5. As a last step, reinstall the latest VC++ 2015-2022 redistributable from Microsoft.$fx$,
  now() - interval '11 days'
),
(
  'Low FPS and Stuttering with High-End Hardware',
  'low-fps-stuttering-high-end-hardware',
  'Performance',
  $fx$A powerful PC runs the game worse than expected, with stutters during fast camera movement.$fx$,
  $fx$FPS is far below benchmarks. Frame time spikes every few seconds. GPU usage stays below 90%.$fx$,
  $fx$1. Check your CPU temperatures with MSI Afterburner, thermal throttling caps clocks and causes this exact symptom.
2. Disable Windows Game Mode and the Game Bar overlay.
3. Set the game to fullscreen mode, not borderless.
4. Update your chipset drivers, not just the GPU driver.
5. Disable any FPS cap in the game and in the driver panel, then test.
6. If you have an Intel CPU, run the game with Performance cores only if the scheduler misbehaves.$fx$,
  now() - interval '8 days'
),
(
  'Game Not Opening / No Response After Clicking Play',
  'game-not-opening-after-clicking-play',
  'Launcher',
  $fx$Clicking Play does nothing or the process appears in Task Manager and disappears after a few seconds.$fx$,
  $fx$No window appears. The process runs briefly in Task Manager and exits with no dialog.$fx$,
  $fx$1. Add the game folder and launcher folder to your antivirus exclusions, then restart the launcher.
2. Run the game's exe directly from the install folder as administrator.
3. Install the required runtimes: DirectX, VC++ x86 and x64, and .NET 6 or higher.
4. Check for a missing DLL by running the exe from a command prompt to see the error text.
5. Rename the game's config folder to force a reset.
6. If the game uses Denuvo or an online check, launch it while online and try the offline mode only after first launch.$fx$,
  now() - interval '6 days'
),
(
  'Game Freezes During Loading Screen',
  'game-freezes-during-loading-screen',
  'Errors',
  $fx$The game locks up on a loading screen, often with a spinning cursor, and never reaches the menu.$fx$,
  $fx$Loading bar stops or a tip screen stays frozen. The window becomes unresponsive and has to be force-closed.$fx$,
  $fx$1. Wait 2-3 minutes first, some games compile shaders on first load and look frozen.
2. Delete the shader cache folder and let the game rebuild it.
3. Lower the texture quality to reduce VRAM pressure during loading.
4. Update your page file settings to let Windows manage memory automatically.
5. Move the game to an SSD if it is currently on an HDD.
6. Disable the in-game overlay from the launcher and any recording software.$fx$,
  now() - interval '4 days'
),
(
  'Unable to Join Online Matches (Connection Failed)',
  'unable-to-join-online-matches',
  'Online',
  $fx$The game refuses to connect to online matches or servers, while other games and websites work fine.$fx$,
  $fx$Error codes about NAT, firewall, or failed connections. Joining works in single player and other games are online.$fx$,
  $fx$1. Restart your router and PC, then test the connection again.
2. Temporarily disable your firewall and test, then re-enable it and add rules for the game exe.
3. Enable UPnP in your router settings or forward the ports listed on the game's support page.
4. Check your NAT type in the game settings, strict NAT blocks matchmaking.
5. Disable your VPN or proxy, then check your DNS settings with a public DNS like 8.8.8.8.
6. As a last step, reinstall the game's network components (Winsock reset in an admin command prompt).$fx$,
  now() - interval '2 days'
),
(
  'No Sound or Crackling Audio in Game',
  'no-sound-crackling-audio',
  'Audio',
  $fx$The game has no audio or the audio cracks, stutters, and lags behind the picture.$fx$,
  $fx$Other apps have sound. The game is muted only in its own menus, or audio crackles during high action.$fx$,
  $fx$1. Check the game's audio device setting and select your correct output device.
2. Open Windows Sound settings and set the same device as the default, then restart the game.
3. Set the game's sample rate to 44100 Hz to match Windows.
4. Disable audio enhancements in the device properties.
5. Update your audio drivers from the motherboard or sound card manufacturer.
6. If audio is crackling with Bluetooth, switch to wired headphones or a USB DAC.$fx$,
  now() - interval '1 day'
);
