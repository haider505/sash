// The training program. Everything here is plain English and safe to keep public.
// Personal things (letters, poems, stickers) live in the encrypted vault.

export const EXERCISES = {
  // ---------- glutes ----------
  'glute-bridge': {
    name: 'Glute Bridge', fig: 'glute-bridge', tag: 'glutes', muscles: 'Glutes, hamstrings',
    cues: ['Feet hip-width apart, heels about a hand’s length from your butt.', 'Breathe out, pull your ribs down, then push through your heels.', 'Lift until shoulders, hips and knees make one line. Squeeze hard at the top.', 'Lower slowly and just tap the floor before the next rep.'],
    mistakes: ['Arching your lower back at the top. The lift should come from your glutes, not your spine.', 'Pushing through your toes. Keep the weight in your heels.'],
    easier: 'Smaller lift, 1-second squeeze.', harder: 'Single-Leg Glute Bridge or Couch Hip Thrust.',
    yt: 'glute bridge proper form',
  },
  'frog-pump': {
    name: 'Frog Pumps', fig: 'frog-pump', tag: 'glutes', muscles: 'Glutes (upper)',
    cues: ['Lie on your back, soles of your feet together, knees falling out to the sides.', 'Heels close to your butt.', 'Drive your hips up and squeeze, lower halfway, repeat. Short and quick.'],
    mistakes: ['Letting your knees close in.', 'Lifting with your lower back.'],
    easier: 'Smaller range.', harder: 'Pause 2 seconds at the top, or add pulses.',
    yt: 'frog pumps glute exercise',
  },
  'hip-thrust': {
    name: 'Couch Hip Thrust', fig: 'hip-thrust', tag: 'glutes', muscles: 'Glutes, hamstrings',
    setup: 'Push the couch against a wall so it can’t slide.',
    cues: ['Rest the bottom of your shoulder blades on the couch edge, feet flat and hip-width.', 'Chin tucked, eyes looking forward, not at the ceiling.', 'Drive through your heels until your body is flat like a table. Shins vertical at the top.', 'Squeeze 1–2 seconds, then lower with control.'],
    mistakes: ['Throwing your head back and arching.', 'Feet too close (thighs burn) or too far (hamstrings cramp). Move them until you feel it in your glutes.'],
    easier: 'Glute Bridge on the floor.', harder: 'B-Stance or Single-Leg Hip Thrust, or 1.5 reps.',
    yt: 'bodyweight hip thrust couch form',
  },
  'bstance-hip-thrust': {
    name: 'B-Stance Hip Thrust', fig: 'bstance-hip-thrust', tag: 'glutes', muscles: 'Glutes (one side at a time)', side: 'leg',
    setup: 'Push the couch against a wall so it can’t slide.',
    cues: ['Set up like a hip thrust, then slide one foot forward so only its heel touches the floor. That foot is just a kickstand.', 'Push about 80% through the back foot.', 'Squeeze at the top and keep your hips level.'],
    mistakes: ['Pushing through the kickstand foot.', 'Hips tilting to one side.'],
    easier: 'Regular Couch Hip Thrust.', harder: 'Single-Leg Hip Thrust.',
    yt: 'b stance hip thrust bodyweight',
  },
  'sl-glute-bridge': {
    name: 'Single-Leg Glute Bridge', fig: 'sl-glute-bridge', tag: 'glutes', muscles: 'Glutes, hamstrings', side: 'leg',
    cues: ['One foot planted near your butt, the other leg straight and lifted, thighs level.', 'Push through the planted heel and lift without twisting.', 'Squeeze 1 second at the top.'],
    mistakes: ['The hip on the lifted side dropping.', 'Pushing through your toes.'],
    easier: 'Keep the other heel lightly on the floor.', harder: 'Single-Leg Hip Thrust.',
    yt: 'single leg glute bridge form',
  },
  'sl-hip-thrust': {
    name: 'Single-Leg Hip Thrust', fig: 'sl-hip-thrust', tag: 'glutes', muscles: 'Glutes', side: 'leg',
    setup: 'Push the couch against a wall so it can’t slide.',
    cues: ['Shoulders on the couch, one foot planted under your knee, the other knee pulled up.', 'Push the planted heel down and lift until your body is flat.', 'Keep your hips level, like a glass of water is sitting on your belly.'],
    mistakes: ['Rotating your hips.', 'Dropping fast. Lower slowly.'],
    easier: 'B-Stance Hip Thrust.', harder: '3-second lowering and a pause at the top.',
    yt: 'single leg hip thrust bodyweight',
  },
  'sl-bridge-couch': {
    name: 'Single-Leg Bridge, Foot on Couch', fig: 'sl-bridge-couch', tag: 'glutes', muscles: 'Glutes, hamstrings', side: 'leg',
    cues: ['Lie on the floor with one heel on the couch edge, the other leg up.', 'Dig that heel into the couch and lift your hips.', 'Squeeze 1 second, lower slowly.'],
    mistakes: ['Pushing with the toes instead of the heel.'],
    easier: 'Both heels on the couch.', harder: 'Pause 2 seconds at the top.',
    yt: 'single leg elevated glute bridge',
  },
  'bridge-march': {
    name: 'Glute Bridge March', fig: 'bridge-march', tag: 'core', muscles: 'Core, glutes', side: 'side',
    cues: ['Lift into a bridge and stay there.', 'Slowly lift one knee toward your chest, then put the foot back down. Your hips don’t move.', 'Alternate sides and keep breathing.'],
    mistakes: ['Hips dropping or tipping when a foot lifts.'],
    easier: 'Just hover the foot off the floor.', harder: 'Hold each lift 2 seconds.',
    yt: 'glute bridge march',
  },
  'hamstring-walkout': {
    name: 'Bridge Walkouts', fig: 'hamstring-walkout', tag: 'hamstrings', muscles: 'Hamstrings, glutes',
    cues: ['Lift into a bridge.', 'Take small heel steps away from you, 3 or 4 steps, hips staying up.', 'Walk back in. That’s one rep.'],
    mistakes: ['Hips sinking as your feet walk out.', 'Going so far your hamstrings cramp. Stop just before that.'],
    easier: 'Two steps out only.', harder: 'Pause at the furthest point.',
    yt: 'hamstring walkouts bridge',
  },
  'sliding-leg-curl': {
    name: 'Sliding Leg Curl', fig: 'sliding-leg-curl', tag: 'hamstrings', muscles: 'Hamstrings, glutes',
    setup: 'Socks on a smooth floor, or a small towel under your heels.',
    cues: ['Lift into a bridge with your heels on the towel.', 'Slide your heels away slowly until your legs are almost straight. Hips stay up.', 'Dig your heels down and pull them back in.'],
    mistakes: ['Hips dropping.', 'Rushing.'],
    easier: 'Slide out slowly, lower your hips, then reset (no pull back).', harder: 'One leg at a time.',
    yt: 'sliding hamstring curl towel',
  },
  'donkey-kick': {
    name: 'Donkey Kick', fig: 'donkey-kick', tag: 'glutes', muscles: 'Glutes', side: 'side',
    cues: ['Hands under shoulders, knees under hips.', 'Keep the knee bent and push your foot toward the ceiling, like stamping a footprint up there.', 'Stop when your thigh is level with your back. No arching.', 'Squeeze, then lower slowly.'],
    mistakes: ['Arching your lower back to get higher.', 'Swinging the leg.'],
    easier: 'Smaller range.', harder: 'Hold 2 seconds at the top.',
    yt: 'donkey kicks proper form',
  },
  'fire-hydrant': {
    name: 'Fire Hydrant', fig: 'fire-hydrant', tag: 'glutes', muscles: 'Side glutes (glute medius)', side: 'side',
    cues: ['On hands and knees, belly tight.', 'Lift one knee out to the side, keeping it bent.', 'Keep your hips square. Don’t lean onto the other side.', 'Lower slowly.'],
    mistakes: ['Tilting your whole body.', 'Rushing.'],
    easier: 'Smaller range.', harder: 'Hold 2–3 seconds at the top.',
    yt: 'fire hydrant exercise form',
  },
  'side-lying-abduction': {
    name: 'Side-Lying Hip Abduction', fig: 'side-lying-abduction', tag: 'glutes', muscles: 'Side glutes (glute medius)', side: 'side',
    cues: ['Lie on your side, bottom knee bent for balance, top leg straight.', 'Toes point forward, not up. Heel slightly behind your body.', 'Lift the top leg about 30–40 cm, leading with your heel.', 'Lower slowly. Don’t let it drop.'],
    mistakes: ['Rolling backward.', 'Toes turning up to the ceiling (that moves the work to the front of your hip).'],
    easier: 'Shorter range.', harder: 'Small pulses at the top, or a 3-second hold.',
    yt: 'side lying hip abduction form',
  },
  'clamshell': {
    name: 'Clamshell', fig: 'clamshell', tag: 'glutes', muscles: 'Side glutes (glute medius)', side: 'side',
    cues: ['Lie on your side, hips and knees bent, feet together, hips stacked.', 'Keep your feet touching and open the top knee like a clamshell.', 'Don’t let the top hip roll back.', 'Pause at the top, lower slowly.'],
    mistakes: ['Rolling your pelvis back.', 'Going fast.'],
    easier: 'Smaller range.', harder: 'Hold 2 seconds, or lift both feet a little off the floor.',
    yt: 'clamshell exercise form',
  },
  // ---------- hinges ----------
  'good-morning': {
    name: 'Good Morning', fig: 'good-morning', tag: 'hamstrings', muscles: 'Hamstrings, glutes, lower back',
    cues: ['Stand hip-width, soft knees, arms crossed on your chest.', 'Push your hips back like you’re closing a car door with your butt.', 'Keep your back flat and lower until you feel a stretch behind your legs.', 'Squeeze your glutes to stand up.'],
    mistakes: ['Rounding your back.', 'Bending your knees so it turns into a squat.'],
    easier: 'Smaller range, hands on your thighs.', harder: 'Kickstand RDL.',
    yt: 'bodyweight good morning hip hinge',
  },
  'kickstand-rdl': {
    name: 'Kickstand RDL', fig: 'kickstand-rdl', tag: 'hamstrings', muscles: 'Glutes, hamstrings', side: 'leg',
    cues: ['Stand on one foot. The other foot sits slightly behind, heel up. It’s only there for balance.', 'Push your hips back, back flat, arms hanging straight down.', 'Lower until you feel your hamstring stretch, then drive your hips forward.'],
    mistakes: ['Pushing off the back foot.', 'Rounding your back.'],
    easier: 'Good Morning.', harder: 'Single-Leg RDL.',
    yt: 'kickstand rdl bodyweight',
  },
  'sl-rdl': {
    name: 'Single-Leg RDL', fig: 'sl-rdl', tag: 'hamstrings', muscles: 'Glutes, hamstrings, balance', side: 'leg',
    cues: ['Stand on one leg with a soft knee.', 'Tip forward as the free leg reaches back, like a seesaw.', 'Keep your hips square: the toes of the back leg point down.', 'Fingertips on a wall if you wobble.'],
    mistakes: ['Opening your hip (back toes turning out).', 'Rounding your back.'],
    easier: 'Kickstand RDL.', harder: '3 seconds down with a pause at the bottom.',
    yt: 'single leg rdl bodyweight form',
  },
  // ---------- squats & lunges ----------
  'box-squat': {
    name: 'Box Squat', fig: 'box-squat', tag: 'quads', muscles: 'Quads, glutes',
    setup: 'A sturdy chair behind you.',
    cues: ['Stand in front of the chair, feet shoulder-width, toes slightly out.', 'Sit back and down until your butt lightly taps the chair. Don’t sit.', 'Knees follow your toes, chest up.', 'Push the floor away to stand.'],
    mistakes: ['Dropping onto the chair.', 'Knees falling in.'],
    easier: 'Put a cushion on the chair.', harder: 'Tempo Squat with no chair.',
    yt: 'box squat bodyweight form',
  },
  'squat': {
    name: 'Tempo Squat', fig: 'squat', tag: 'quads', muscles: 'Quads, glutes',
    cues: ['Feet shoulder-width, toes slightly out.', '3 seconds down, pause 1 second at the bottom, stand up strong.', 'Knees push out over your toes, heels stay down.'],
    mistakes: ['Heels lifting.', 'Bouncing out of the bottom.'],
    easier: 'Box Squat.', harder: 'Heel-Elevated Squat, or 1.5 reps.',
    yt: 'tempo squat bodyweight',
  },
  'heel-elevated-squat': {
    name: 'Heel-Elevated Squat', fig: 'heel-elevated-squat', tag: 'quads', muscles: 'Quads, glutes',
    setup: 'A thick book or a step edge under your heels.',
    cues: ['Heels on the book, toes on the floor.', 'Sit straight down with your chest tall; your knees travel forward.', '3 seconds down, drive up.'],
    mistakes: ['Leaning far forward.'],
    easier: 'A thinner book, or a shorter range.', harder: '1.5 reps.',
    yt: 'heel elevated squat bodyweight',
  },
  'sumo-squat': {
    name: 'Sumo Squat', fig: 'sumo-squat', tag: 'glutes', muscles: 'Glutes, inner thighs, quads',
    cues: ['Wide stance, toes turned out.', 'Sit straight down, pushing your knees out over your toes.', 'Chest tall. Squeeze your glutes at the top.'],
    mistakes: ['Knees falling in.', 'Leaning forward.'],
    easier: 'Shallower.', harder: 'Pause 2 seconds at the bottom, or add pulses.',
    yt: 'sumo squat bodyweight form',
  },
  'wall-sit': {
    name: 'Wall Sit', fig: 'wall-sit', tag: 'quads', muscles: 'Quads',
    cues: ['Back flat on the wall, slide down until your thighs are close to parallel.', 'Knees over ankles, weight in your heels.', 'Keep breathing. Don’t hold your breath.'],
    mistakes: ['Pushing on your thighs with your hands.'],
    easier: 'Sit a little higher.', harder: 'Sit lower or hold longer.',
    yt: 'wall sit proper form',
  },
  'step-up': {
    name: 'Step-Up', fig: 'step-up', tag: 'glutes', muscles: 'Glutes, quads', side: 'leg',
    setup: 'Use the bottom stair or a very stable low step. No wobbly chairs.',
    cues: ['Whole foot on the step.', 'Lean slightly forward and push through the heel of the top foot. Don’t push off the floor foot.', 'Stand tall at the top, then lower slowly.'],
    mistakes: ['Pushing off the back foot.', 'Knee falling in.'],
    easier: 'A lower step.', harder: 'A higher step, or a slower lowering.',
    yt: 'step up exercise glutes form',
  },
  'reverse-lunge': {
    name: 'Reverse Lunge', fig: 'reverse-lunge', tag: 'glutes', muscles: 'Glutes, quads', side: 'leg',
    cues: ['Stand tall, step one foot back and lower until your back knee nearly touches the floor.', 'Front shin stays fairly upright, weight in the front heel.', 'Push through the front foot to come back.', 'A hand on the wall for balance is completely fine.'],
    mistakes: ['A short step, so the front knee shoots forward.', 'Leaning back.'],
    easier: 'Split Squat.', harder: 'Deficit Reverse Lunge.',
    yt: 'reverse lunge proper form',
  },
  'deficit-reverse-lunge': {
    name: 'Deficit Reverse Lunge', fig: 'deficit-reverse-lunge', tag: 'glutes', muscles: 'Glutes, quads', side: 'leg',
    setup: 'Front foot on a thick book or the bottom stair.',
    cues: ['Step back and sink deeper than a normal lunge.', 'A slight forward lean puts more of the work in your glutes.', 'Drive up through the front heel.'],
    mistakes: ['Rushing the bottom.'],
    easier: 'Reverse Lunge.', harder: 'Pause at the bottom.',
    yt: 'deficit reverse lunge',
  },
  'split-squat': {
    name: 'Split Squat', fig: 'split-squat', tag: 'quads', muscles: 'Quads, glutes', side: 'leg',
    cues: ['Long stance, back heel up.', 'Drop straight down, back knee toward the floor.', 'Push through the front heel.'],
    mistakes: ['Stance too short.', 'Front knee falling in.'],
    easier: 'Smaller range.', harder: 'Bulgarian Split Squat.',
    yt: 'split squat form',
  },
  'bulgarian-split-squat': {
    name: 'Bulgarian Split Squat', fig: 'bulgarian-split-squat', tag: 'glutes', muscles: 'Glutes, quads', side: 'leg',
    setup: 'Back foot on the couch. Push the couch against a wall.',
    cues: ['Top of your back foot on the couch. Front foot far enough forward that your knee stays roughly over your ankle at the bottom.', 'Lean your chest slightly forward to bias your glutes.', 'Lower until the back knee nearly touches, then drive through the front heel.'],
    mistakes: ['Front foot too close to the couch.', 'Pushing with the back leg.'],
    easier: 'Split Squat.', harder: '1.5 reps, or a pause at the bottom.',
    yt: 'bulgarian split squat glutes form',
  },
  'curtsy-lunge': {
    name: 'Curtsy Lunge', fig: 'curtsy-lunge', tag: 'glutes', muscles: 'Side glutes, glutes, quads', side: 'leg',
    cues: ['Step one leg behind and across, like a curtsy.', 'Hips keep facing forward.', 'Front knee tracks over your toes; push up through the front heel.'],
    mistakes: ['Twisting your hips.', 'Crossing too far.'],
    easier: 'Hand on a wall, smaller range.', harder: 'Pause at the bottom.',
    yt: 'curtsy lunge form',
  },
  'lateral-lunge': {
    name: 'Lateral Lunge', fig: 'lateral-lunge', tag: 'glutes', muscles: 'Glutes, inner thighs, quads', side: 'side',
    cues: ['Wide stance. Shift to one side, bending that knee while the other leg stays straight.', 'Sit your hips back; both feet stay flat.', 'Push back to the middle.'],
    mistakes: ['Knee falling in.', 'Heel lifting.'],
    easier: 'Smaller range.', harder: 'Pause at the bottom, or Cossack Squat.',
    yt: 'lateral lunge form',
  },
  'cossack-squat': {
    name: 'Cossack Squat', fig: 'cossack-squat', tag: 'glutes', muscles: 'Inner thighs, glutes, quads', side: 'side',
    cues: ['Wide stance. Sink deep to one side; the straight leg’s toes turn up.', 'Chest up, heel of the bent leg down.', 'Hold a chair in front of you if you need it.'],
    mistakes: ['Rounding your back.'],
    easier: 'Lateral Lunge.', harder: 'Full depth with no support.',
    yt: 'cossack squat beginner',
  },
  'skater-squat': {
    name: 'Skater Squat', fig: 'skater-squat', tag: 'quads', muscles: 'Quads, glutes, balance', side: 'leg',
    setup: 'A cushion on the floor behind you.',
    cues: ['Stand on one leg, the other knee bent behind you.', 'Lower until your back knee touches the cushion. Lean forward, arms out.', 'Stand up through your heel.'],
    mistakes: ['Rushing down.'],
    easier: 'A thicker cushion, or hold a chair.', harder: 'A lower target.',
    yt: 'skater squat beginner',
  },
  // ---------- core ----------
  'dead-bug': {
    name: 'Dead Bug', fig: 'dead-bug', tag: 'core', muscles: 'Deep core', side: 'side',
    cues: ['On your back, arms up, knees over hips at 90°.', 'Press your lower back into the floor and keep it there.', 'Slowly reach one arm back and the opposite leg out while you breathe out.', 'Come back and switch.'],
    mistakes: ['Lower back lifting off the floor.', 'Moving fast.'],
    easier: 'Move only the legs (Heel Taps).', harder: 'Straight legs, or a 3-second breath out on every reach.',
    yt: 'dead bug exercise form',
  },
  'heel-taps': {
    name: 'Heel Taps', fig: 'heel-taps', tag: 'core', muscles: 'Lower abs, deep core', side: 'side',
    cues: ['On your back, knees over hips at 90°.', 'Keep the knee bent and lower one heel to tap the floor.', 'Lower back stays flat. Alternate.'],
    mistakes: ['Arching your back.'],
    easier: 'Smaller range.', harder: 'Dead Bug.',
    yt: 'supine heel taps core',
  },
  'forearm-plank': {
    name: 'Forearm Plank', fig: 'forearm-plank', tag: 'core', muscles: 'Core',
    cues: ['Elbows under shoulders, body in one straight line.', 'Squeeze your glutes and pull your belly in.', 'Breathe slowly.'],
    mistakes: ['Hips sagging.', 'Hips too high.'],
    easier: 'Knees down.', harder: 'RKC Plank.',
    yt: 'forearm plank proper form',
  },
  'rkc-plank': {
    name: 'RKC Plank', fig: 'forearm-plank', tag: 'core', muscles: 'Core',
    cues: ['Forearm plank with your feet together.', 'Squeeze your glutes and thighs hard. Pull your elbows toward your toes (they don’t actually move).', 'It should shake. 20 seconds is plenty.'],
    mistakes: ['Holding your breath.'],
    easier: 'Regular Forearm Plank.', harder: 'Longer hold.',
    yt: 'rkc plank',
  },
  'plank-shoulder-tap': {
    name: 'Plank Shoulder Taps', fig: 'plank-shoulder-tap', tag: 'core', muscles: 'Core', side: 'side',
    cues: ['High plank, feet wider than your hips.', 'Lift one hand to tap the opposite shoulder without rocking your hips.', 'Slow and controlled.'],
    mistakes: ['Hips swaying side to side.'],
    easier: 'From your knees.', harder: 'Feet closer together.',
    yt: 'plank shoulder taps form',
  },
  'side-plank-knees': {
    name: 'Side Plank from Knees', fig: 'side-plank-knees', tag: 'core', muscles: 'Obliques, side glutes', side: 'side',
    cues: ['Elbow under your shoulder, knees bent behind you.', 'Lift your hips so your head, hips and knees line up.', 'Don’t let your hips sag.'],
    mistakes: ['Shoulder shrugging up to your ear.'],
    easier: 'Shorter holds.', harder: 'Full Side Plank.',
    yt: 'modified side plank knees',
  },
  'side-plank': {
    name: 'Side Plank', fig: 'side-plank', tag: 'core', muscles: 'Obliques, side glutes', side: 'side',
    cues: ['Elbow under your shoulder, feet stacked or one in front of the other.', 'Lift your hips into one straight line from head to heels.', 'Top hand on your hip.'],
    mistakes: ['Hips sagging or rolling back.'],
    easier: 'Side Plank from Knees.', harder: 'Side Plank Hip Dips.',
    yt: 'side plank proper form',
  },
  'side-plank-dip': {
    name: 'Side Plank Hip Dips', fig: 'side-plank-dip', tag: 'core', muscles: 'Obliques', side: 'side',
    cues: ['From a side plank, lower your hips a few centimetres.', 'Lift back up, a little higher than where you started.', 'Smooth, no bouncing.'],
    mistakes: ['Collapsing into your shoulder.'],
    easier: 'From your knees.', harder: 'Slower, with a pause at the top.',
    yt: 'side plank hip dips',
  },
  'copenhagen': {
    name: 'Copenhagen Plank (Short)', fig: 'copenhagen', tag: 'core', muscles: 'Inner thighs, core', side: 'side',
    setup: 'Couch against a wall.',
    cues: ['Side plank with your top knee on the couch and the bottom leg hanging below.', 'Press the top knee into the couch and lift your hips.', 'Hold, then switch sides.'],
    mistakes: ['Hips sagging.'],
    easier: 'Shorter holds.', harder: 'Lift the bottom leg up toward the couch.',
    yt: 'short lever copenhagen plank',
  },
  'bird-dog': {
    name: 'Bird Dog', fig: 'bird-dog', tag: 'core', muscles: 'Core, glutes, back', side: 'side',
    cues: ['On hands and knees, back flat.', 'Reach one arm forward and the opposite leg back. Hold 2 seconds.', 'Hips stay level, like a cup of tea is resting on your lower back.'],
    mistakes: ['Arching.', 'Rotating your hips.'],
    easier: 'Move only the leg.', harder: 'Bird Dog Crunch.',
    yt: 'bird dog exercise form',
  },
  'bird-dog-crunch': {
    name: 'Bird Dog Crunch', fig: 'bird-dog-crunch', tag: 'core', muscles: 'Core', side: 'side',
    cues: ['From a bird dog, bring your elbow and opposite knee together under your belly.', 'Breathe out and round a little, then stretch long again.'],
    mistakes: ['Rushing the stretch-out.'],
    easier: 'Regular Bird Dog.', harder: 'Hold the long position 2 seconds.',
    yt: 'bird dog crunch',
  },
  'bear-hold': {
    name: 'Bear Hold', fig: 'bear-hold', tag: 'core', muscles: 'Core, shoulders',
    cues: ['On hands and knees, toes tucked.', 'Lift your knees 3 cm off the floor, back flat.', 'Breathe and hold.'],
    mistakes: ['Hips too high.'],
    easier: 'Put your knees down for a second between holds.', harder: 'Bear Shoulder Taps.',
    yt: 'bear hold exercise',
  },
  'bear-tap': {
    name: 'Bear Shoulder Taps', fig: 'bear-tap', tag: 'core', muscles: 'Core', side: 'side',
    cues: ['Bear hold with your knees hovering.', 'Tap one hand to the opposite shoulder without rocking.'],
    mistakes: ['Shifting your hips.'],
    easier: 'Bear Hold.', harder: 'Slower taps.',
    yt: 'bear plank shoulder taps',
  },
  'bear-crawl': {
    name: 'Bear Crawl', fig: 'bear-crawl', tag: 'core', muscles: 'Core, full body',
    cues: ['Bear hold with your knees hovering.', 'Step opposite hand and foot forward a little, then back. Small steps.', 'Flat back the whole time. A small room is enough.'],
    mistakes: ['Hips popping up.'],
    easier: 'Bear Hold.', harder: 'Longer sets.',
    yt: 'bear crawl beginner form',
  },
  'mountain-climber': {
    name: 'Slow Mountain Climbers', fig: 'mountain-climber', tag: 'core', muscles: 'Core', side: 'side',
    cues: ['High plank.', 'Drive one knee toward your chest, put it back, switch.', 'Slow and controlled. Hips stay down.'],
    mistakes: ['Bouncing your hips up.'],
    easier: 'Hands on the couch.', harder: 'A little faster, still clean.',
    yt: 'slow mountain climbers',
  },
  'reverse-crunch': {
    name: 'Reverse Crunch', fig: 'reverse-crunch', tag: 'core', muscles: 'Lower abs',
    cues: ['On your back, knees bent at 90°, hands by your sides.', 'Breathe out and curl your hips off the floor, knees toward your chest.', 'Lower slowly. No swinging.'],
    mistakes: ['Using momentum.'],
    easier: 'Smaller range.', harder: 'Leg Lowers.',
    yt: 'reverse crunch proper form',
  },
  'hollow-hold': {
    name: 'Hollow Hold (Tucked)', fig: 'hollow-hold', tag: 'core', muscles: 'Core',
    cues: ['Lower back pressed into the floor.', 'Lift your head and shoulders, knees tucked, arms reaching forward.', 'Hold and breathe.'],
    mistakes: ['Lower back lifting.'],
    easier: 'Head down, just the legs.', harder: 'Straighten your legs and reach your arms overhead.',
    yt: 'tuck hollow hold',
  },
  'leg-lowers': {
    name: 'Leg Lowers', fig: 'leg-lowers', tag: 'core', muscles: 'Lower abs',
    cues: ['On your back, legs straight up, hands under your hips if you like.', 'Lower your legs slowly while your lower back stays flat.', 'Stop before your back arches, then lift back up.'],
    mistakes: ['Back arching at the bottom.'],
    easier: 'Bent knees.', harder: 'Lower further.',
    yt: 'leg lowers core',
  },
  // ---------- warm-up & cool-down ----------
  'breathing': {
    name: 'Belly Breathing', fig: 'breathing', tag: 'mobility', muscles: 'Diaphragm, deep core',
    cues: ['On your back, knees bent, one hand on your belly.', 'Breathe in through your nose for 4 seconds: belly and sides expand.', 'Breathe out for 6 seconds and let your ribs drop.'],
    mistakes: ['Lifting your shoulders to breathe.'],
    easier: '', harder: '', yt: '360 breathing exercise',
  },
  'cat-cow': {
    name: 'Cat–Cow', fig: 'cat-cow', tag: 'mobility', muscles: 'Spine',
    cues: ['On hands and knees.', 'Breathe in: drop your belly and look up.', 'Breathe out: round your back toward the ceiling.'],
    mistakes: ['Moving only your neck.'], easier: '', harder: '', yt: 'cat cow stretch',
  },
  'leg-swing': {
    name: 'Leg Swings', fig: 'leg-swing', tag: 'mobility', muscles: 'Hips', side: 'leg',
    cues: ['Hold a wall. Swing one leg forward and back, relaxed.', 'Start small and let the swing grow.'],
    mistakes: ['Arching your back on the back swing.'], easier: '', harder: '', yt: 'leg swings warm up',
  },
  'hip-flexor-stretch': {
    name: 'Hip Flexor Stretch', fig: 'hip-flexor-stretch', tag: 'mobility', muscles: 'Front of the hip', side: 'side',
    cues: ['One knee down on a cushion, the other foot forward.', 'Tuck your tailbone under, squeeze the back glute, shift forward a little.', 'Feel it in the front of the back hip.'],
    mistakes: ['Arching your lower back.'], easier: '', harder: '', yt: 'half kneeling hip flexor stretch',
  },
  'figure-4': {
    name: 'Figure-4 Stretch', fig: 'figure-4', tag: 'mobility', muscles: 'Glutes', side: 'side',
    cues: ['On your back, cross one ankle over the other knee.', 'Pull the bottom thigh toward you.', 'Breathe and let it relax.'],
    mistakes: ['Pulling your head up.'], easier: '', harder: '', yt: 'supine figure 4 stretch',
  },
  'hamstring-stretch': {
    name: 'Seated Hamstring Stretch', fig: 'hamstring-stretch', tag: 'mobility', muscles: 'Hamstrings', side: 'side',
    cues: ['Sit with one leg straight and the other bent.', 'Fold forward from your hips with a long back.', 'Breathe; go a little further on each breath out.'],
    mistakes: ['Rounding hard through your upper back.'], easier: '', harder: '', yt: 'seated hamstring stretch',
  },
  'childs-pose': {
    name: 'Child’s Pose', fig: 'childs-pose', tag: 'mobility', muscles: 'Back, hips',
    cues: ['Knees wide, big toes together, sit back toward your heels.', 'Arms long, forehead down.', 'Breathe into your back.'],
    mistakes: [], easier: '', harder: '', yt: 'childs pose',
  },
  // ---------- period care ----------
  'knees-to-chest': {
    name: 'Knees-to-Chest Rock', fig: 'knees-to-chest', tag: 'care', muscles: 'Lower back',
    cues: ['On your back, hug both knees in.', 'Rock gently side to side or in small circles.'],
    mistakes: [], easier: '', harder: '', yt: 'knees to chest stretch',
  },
  'supine-twist': {
    name: 'Supine Twist', fig: 'supine-twist', tag: 'care', muscles: 'Back, hips', side: 'side',
    cues: ['On your back, arms out wide.', 'Let both knees fall to one side. Shoulders stay heavy.', 'Breathe, then switch.'],
    mistakes: [], easier: '', harder: '', yt: 'supine spinal twist',
  },
  'reclined-butterfly': {
    name: 'Reclined Butterfly', fig: 'reclined-butterfly', tag: 'care', muscles: 'Hips, belly',
    cues: ['On your back, soles of your feet together, knees falling open.', 'Pillows under your knees.', 'Hands on your belly. Slow breaths.'],
    mistakes: [], easier: '', harder: '', yt: 'reclined butterfly pose',
  },
  'legs-up-wall': {
    name: 'Legs Up the Wall', fig: 'legs-up-wall', tag: 'care', muscles: 'Rest',
    cues: ['Lie with your hips close to a wall and your legs resting up on it.', 'Arms relaxed. Slow breaths.', 'Skip it if it doesn’t feel good today.'],
    mistakes: [], easier: '', harder: '', yt: 'legs up the wall pose',
  },
  'walk': {
    name: 'Easy Walk', fig: 'walk', tag: 'care', muscles: 'Everything, gently',
    cues: ['15–20 minutes at an easy pace.', 'Outside if you can, music on.'],
    mistakes: [], easier: '', harder: '', yt: '',
  },
};

// ---------- warm-up & cool-down (every training day) ----------
export const WARMUP = [
  { ex: 'breathing', dose: '5 slow breaths', secs: 50 },
  { ex: 'cat-cow', dose: '8 rounds' },
  { ex: 'glute-bridge', dose: '10 reps, squeeze 2 s' },
  { ex: 'leg-swing', dose: '10 / leg' },
  { ex: 'squat', dose: '8 slow reps' },
  { ex: 'good-morning', dose: '8 reps' },
];
export const COOLDOWN = [
  { ex: 'hip-flexor-stretch', dose: '30 s / side', secs: 30, sides: 2 },
  { ex: 'figure-4', dose: '30 s / side', secs: 30, sides: 2 },
  { ex: 'hamstring-stretch', dose: '30 s / side', secs: 30, sides: 2 },
  { ex: 'childs-pose', dose: '45 s', secs: 45 },
];

// ---------- the 12 weeks ----------
// sets / reps / secs can be arrays: one value per week of the phase.
const M = (ex, sets, reps, rest, note = '', extra = {}) => Object.assign({ ex, sets, reps, rest, note }, extra);

export const PHASES = [
  {
    n: 1, name: 'Foundation', weeks: [1, 2, 3, 4],
    line: 'Learn the moves. Wake up the glutes.',
    about: 'Four weeks to learn every movement properly and teach your glutes to do the work. Nothing should feel crushing. Week 1 is only two sets of everything, on purpose.',
    tempo: 'Lower in 2 seconds, squeeze for 1, lift in 1.',
    effort: 'Stop each set with about 3 good reps left in the tank.',
    weekNotes: [
      'Two sets of everything. Learn the movements and leave feeling fresh.',
      'Three sets. Same moves, more practice.',
      'Three sets. Aim for the top of every rep range.',
      'Three sets with a slower lowering. Do your check-in at the end of the week.',
    ],
    days: [
      { id: 'A', title: 'Glutes & Hamstrings', blocks: [
        { type: 'main', items: [
          M('glute-bridge', [2, 3, 3, 3], '15', 60, 'Squeeze 2 s at the top'),
          M('good-morning', [2, 3, 3, 3], '12', 60),
          M('reverse-lunge', [2, 3, 3, 3], '8 / leg', 60, 'Hand on a wall if you wobble'),
          M('side-lying-abduction', [2, 2, 3, 3], '12 / side', 45),
        ] },
        { type: 'core', items: [
          M('dead-bug', [2, 3, 3, 3], '6 / side', 30, 'Slow. Breathe out as you reach'),
          M('forearm-plank', [2, 3, 3, 3], null, 30, 'Knees down is fine', { secs: [20, 20, 25, 30] }),
        ] },
      ] },
      { id: 'B', title: 'Quads & Glutes', blocks: [
        { type: 'main', items: [
          M('box-squat', [2, 3, 3, 3], '12', 60),
          M('step-up', [2, 3, 3, 3], '8 / leg', 60, 'Bottom stair'),
          M('wall-sit', [2, 3, 3, 3], null, 45, '', { secs: [20, 25, 30, 30] }),
          M('clamshell', [2, 3, 3, 3], '15 / side', 30),
        ] },
        { type: 'core', items: [
          M('bird-dog', [2, 3, 3, 3], '6 / side', 30, 'Hold each reach 2 s'),
          M('side-plank-knees', [2, 2, 3, 3], null, 30, 'Each side', { secs: [15, 15, 20, 20], perSide: true }),
        ] },
      ] },
      { id: 'C', title: 'Glutes & Hamstrings', blocks: [
        { type: 'main', items: [
          M('hip-thrust', [2, 3, 3, 3], '12–15', 60, 'Squeeze 1 s at the top'),
          M('frog-pump', [2, 2, 3, 3], '20', 45),
          M('split-squat', [2, 3, 3, 3], '8 / leg', 60),
          M('donkey-kick', [2, 3, 3, 3], '12 / side', 30),
        ] },
        { type: 'core', items: [
          M('bridge-march', [2, 3, 3, 3], '6 / side', 30),
          M('reverse-crunch', [2, 3, 3, 3], '10', 30),
        ] },
      ] },
      { id: 'D', title: 'Legs & Balance', blocks: [
        { type: 'main', items: [
          M('sumo-squat', [2, 3, 3, 3], '12–15', 60),
          M('kickstand-rdl', [2, 3, 3, 3], '10 / leg', 60),
          M('lateral-lunge', [2, 3, 3, 3], '8 / side', 60, 'A short range is fine'),
          M('fire-hydrant', [2, 2, 3, 3], '12 / side', 30),
        ] },
        { type: 'core', items: [
          M('bear-hold', [2, 3, 3, 3], null, 30, '', { secs: [20, 20, 25, 30] }),
          M('heel-taps', [2, 3, 3, 3], '8 / side', 30),
        ] },
      ] },
    ],
  },
  {
    n: 2, name: 'Build', weeks: [5, 6, 7, 8],
    line: 'One leg at a time. Slower lowering. Real burn.',
    about: 'Now the same muscles work harder without any weights: single-leg moves, three-second lowering and pauses at the hardest point. This is where the shape starts to change.',
    tempo: 'Lower in 3 seconds, pause for 1, lift in 1.',
    effort: 'Stop each set with about 2 good reps left.',
    weekNotes: [
      'New moves. Learn them over three sets.',
      'Three sets. Hit the top of the rep ranges.',
      'Four sets on the first two moves. The hardest week of this phase.',
      'Back to three sets, your best form yet. Check-in at the end of the week.',
    ],
    days: [
      { id: 'A', title: 'Glutes & Hamstrings', blocks: [
        { type: 'main', items: [
          M('hip-thrust', [3, 3, 4, 3], '10–12', 75, '1.5 reps: all the way down, halfway up, down again, then all the way up. That’s one.', { label: 'Couch Hip Thrust, 1.5 reps' }),
          M('sl-rdl', [3, 3, 4, 3], '8 / leg', 60, 'Fingertips on a wall'),
          M('reverse-lunge', [3, 3, 3, 3], '10 / leg', 60, 'Pause 1 s at the bottom'),
          M('sl-glute-bridge', [3, 3, 3, 3], '10 / side', 45),
        ] },
        { type: 'core', items: [
          M('dead-bug', [3, 3, 3, 3], '8 / side', 30, 'A 3-second breath out on every reach'),
          M('plank-shoulder-tap', [3, 3, 3, 3], '8 / side', 30),
        ] },
      ] },
      { id: 'B', title: 'Quads & Glutes', blocks: [
        { type: 'main', items: [
          M('bulgarian-split-squat', [3, 3, 4, 3], '8 / leg', 75),
          M('squat', [3, 3, 4, 3], '12', 60, '3 s down, 1 s pause'),
          M('step-up', [3, 3, 3, 3], '10 / leg', 60, 'Lower in 3 s'),
          M('side-lying-abduction', [3, 3, 3, 3], '12 + 10 pulses / side', 30),
        ] },
        { type: 'core', items: [
          M('side-plank', [3, 3, 3, 3], null, 30, 'Each side. Knees down if your hips sag', { secs: [20, 25, 30, 30], perSide: true }),
          M('hollow-hold', [3, 3, 3, 3], null, 30, '', { secs: [15, 20, 20, 25] }),
        ] },
      ] },
      { id: 'C', title: 'Glutes & Hamstrings', blocks: [
        { type: 'main', items: [
          M('bstance-hip-thrust', [3, 3, 4, 3], '10 / leg', 60),
          M('hamstring-walkout', [3, 3, 3, 3], '6', 60),
          M('curtsy-lunge', [3, 3, 3, 3], '8 / leg', 60, 'Hand on a wall'),
          M('frog-pump', [2, 2, 3, 2], '20 + 10 pulses', 45),
        ] },
        { type: 'core', items: [
          M('reverse-crunch', [3, 3, 3, 3], '12', 30),
          M('bird-dog-crunch', [3, 3, 3, 3], '8 / side', 30),
        ] },
      ] },
      { id: 'D', title: 'Legs & Balance', blocks: [
        { type: 'main', items: [
          M('cossack-squat', [3, 3, 3, 3], '6 / side', 60, 'Hold a chair'),
          M('sl-rdl', [3, 3, 4, 3], '8 / leg', 60, 'No support'),
          M('lateral-lunge', [3, 3, 3, 3], '8 / side', 60, 'Pause 1 s at the bottom'),
          M('fire-hydrant', [3, 3, 3, 3], '10 / side', 30, 'Hold 2 s at the top'),
        ] },
        { type: 'core', items: [
          M('bear-tap', [3, 3, 3, 3], '8 / side', 30),
          M('mountain-climber', [3, 3, 3, 3], '10 / side', 30, 'Slow'),
        ] },
      ] },
    ],
  },
  {
    n: 3, name: 'Sculpt', weeks: [9, 10, 11, 12],
    line: 'Harder sets. Real shape.',
    about: 'The hardest versions of everything, closer to your limit, with short finishers at the end. By now your body can do things it couldn’t in week 1.',
    tempo: 'Lower in 3 seconds, pause for 1, and squeeze 2 at the top of glute moves.',
    effort: 'Stop each set with 1–2 good reps left.',
    weekNotes: [
      'Three sets. The hardest variations are new; learn them.',
      'Four sets on the first move.',
      'Peak week: four sets on the first two moves.',
      'Three sets, then your final check-in. Compare it with week 1.',
    ],
    days: [
      { id: 'A', title: 'Glutes & Hamstrings', blocks: [
        { type: 'main', items: [
          M('sl-hip-thrust', [3, 4, 4, 3], '10 / leg', 75),
          M('sl-rdl', [3, 3, 4, 3], '10 / leg', 60, '3 s down, pause at the bottom'),
          M('deficit-reverse-lunge', [3, 3, 4, 3], '10 / leg', 75),
          M('sliding-leg-curl', [3, 3, 3, 3], '8', 60),
        ] },
        { type: 'core', items: [
          M('dead-bug', [3, 3, 3, 3], '8 / side', 30, 'Straight legs', { label: 'Dead Bug, long lever' }),
          M('rkc-plank', [3, 3, 3, 3], null, 30, '', { secs: [20, 20, 25, 25] }),
        ] },
        { type: 'finisher', items: [
          M('frog-pump', [1, 1, 1, 1], '30, then hold the top 30 s', 0),
        ] },
      ] },
      { id: 'B', title: 'Quads & Glutes', blocks: [
        { type: 'main', items: [
          M('bulgarian-split-squat', [3, 4, 4, 3], '8 / leg', 75, '1.5 reps', { label: 'Bulgarian Split Squat, 1.5 reps' }),
          M('heel-elevated-squat', [3, 3, 4, 3], '15', 60, '3 s down'),
          M('skater-squat', [3, 3, 3, 3], '6 / leg', 60, 'Hold a chair'),
          M('side-lying-abduction', [3, 3, 3, 3], '12 / side', 30, 'Hold 3 s at the top'),
        ] },
        { type: 'core', items: [
          M('side-plank-dip', [3, 3, 3, 3], '10 / side', 30),
          M('leg-lowers', [3, 3, 3, 3], '10', 30),
        ] },
        { type: 'finisher', items: [
          M('wall-sit', [1, 1, 1, 1], 'As long as you can', 0, 'Write your time in the notes'),
        ] },
      ] },
      { id: 'C', title: 'Glutes & Hamstrings', blocks: [
        { type: 'main', items: [
          M('hip-thrust', [3, 4, 4, 3], '12 + 10 pulses', 75, 'Squeeze 3 s at the top'),
          M('sl-bridge-couch', [3, 3, 3, 3], '10 / leg', 60),
          M('step-up', [3, 3, 4, 3], '10 / leg', 60, 'Higher step, lower in 3 s'),
          M('donkey-kick', [3, 3, 3, 3], '12 / side', 30, 'Hold 2 s at the top'),
        ] },
        { type: 'core', items: [
          M('reverse-crunch', [3, 3, 3, 3], '12', 30, 'Lift your hips at the top'),
          M('copenhagen', [3, 3, 3, 3], null, 30, 'Each side', { secs: [15, 15, 20, 20], perSide: true }),
        ] },
      ] },
      { id: 'D', title: 'Legs & Balance', blocks: [
        { type: 'main', items: [
          M('cossack-squat', [3, 3, 3, 3], '8 / side', 60, 'Full range'),
          M('curtsy-lunge', [3, 3, 4, 3], '10 / leg', 60, 'No support, pause at the bottom'),
          M('hamstring-walkout', [3, 3, 3, 3], '8', 60),
          M('fire-hydrant', [3, 3, 3, 3], '12 / side', 30, 'Hold 3 s at the top'),
        ] },
        { type: 'core', items: [
          M('bear-crawl', [3, 3, 3, 3], null, 30, '', { secs: [20, 25, 30, 30] }),
          M('mountain-climber', [3, 3, 3, 3], '12 / side', 30),
        ] },
        { type: 'finisher', items: [
          M('frog-pump', [1, 1, 1, 1], '50, as fast as stays clean', 0),
        ] },
      ] },
    ],
  },
];

export const DAY_IDS = ['A', 'B', 'C', 'D'];
export const TOTAL_SESSIONS = 48;

// ---------- period days ----------
export const SANCTUARY = [
  { ex: 'breathing', dose: '2 min: in for 4, out for 6', secs: 120 },
  { ex: 'knees-to-chest', dose: '1 min, gentle rocking', secs: 60 },
  { ex: 'supine-twist', dose: '45 s / side', secs: 45, sides: 2 },
  { ex: 'cat-cow', dose: '8 slow rounds' },
  { ex: 'childs-pose', dose: '90 s, a pillow under your chest', secs: 90 },
  { ex: 'reclined-butterfly', dose: '2 min, pillows under your knees', secs: 120 },
  { ex: 'legs-up-wall', dose: '2–3 min', secs: 150 },
];
export const LIGHT_DAY = [
  { ex: 'walk', dose: '15–20 min, easy pace', secs: 900 },
  { ex: 'glute-bridge', dose: '2 × 12' },
  { ex: 'clamshell', dose: '2 × 12 / side' },
  { ex: 'bird-dog', dose: '2 × 6 / side' },
];
export const COMFORT = [
  { id: 'heat', text: 'Heat on your lower belly or lower back for 15–20 minutes.' },
  { id: 'warm', text: 'Something warm to drink: ginger, cinnamon or chamomile.' },
  { id: 'water', text: 'Water. Bloating often gets better when you drink more, not less.' },
  { id: 'iron', text: 'Iron: red meat, chicken, lentils, chickpeas or spinach, with something sour like lemon or orange so you absorb more of it.' },
  { id: 'mag', text: 'Magnesium: dark chocolate, almonds, pumpkin seeds, bananas, oats.' },
  { id: 'salt', text: 'Go easy on very salty snacks and fizzy drinks; they make bloating worse.' },
  { id: 'sleep', text: 'Sleep longer if you can.' },
];
export const RED_FLAGS = 'Tell a doctor if the pain stops you from normal life even with heat and rest, if you soak through a pad or tampon every hour for several hours, or if your periods suddenly change a lot.';

// ---------- check-ins & habits ----------
export const CHECKINS = [
  { id: 'start', label: 'Start', when: 'Before your first workout' },
  { id: 'w4', label: 'Week 4', when: 'End of week 4' },
  { id: 'w8', label: 'Week 8', when: 'End of week 8' },
  { id: 'w12', label: 'Week 12', when: 'End of week 12' },
];
export const TESTS = [
  { id: 'bridge', name: 'Glute bridges in 60 s', unit: 'reps', how: 'Full squeeze on every rep. Count only clean ones.' },
  { id: 'plank', name: 'Forearm plank', unit: 's', how: 'Stop when your hips start to sag.' },
  { id: 'wallsit', name: 'Wall sit', unit: 's', how: 'Thighs close to parallel. Stop when you have to stand.' },
  { id: 'balL', name: 'Balance, left leg', unit: 's', how: 'Hands on hips, eyes open. Stop at 60.' },
  { id: 'balR', name: 'Balance, right leg', unit: 's', how: 'Hands on hips, eyes open. Stop at 60.' },
  { id: 'waist', name: 'Waist (optional)', unit: 'cm', how: 'Narrowest point, relaxed, morning.', optional: true },
  { id: 'hips', name: 'Hips (optional)', unit: 'cm', how: 'Widest point of your glutes, feet together.', optional: true },
];
export const HABITS = [
  { id: 'steps', label: 'Steps', detail: '7,000+ steps', icon: 'steps' },
  { id: 'protein', label: 'Protein', detail: 'Protein at every meal', icon: 'protein' },
  { id: 'water', label: 'Water', detail: '8+ glasses', icon: 'water' },
  { id: 'sleep', label: 'Sleep', detail: '7+ hours', icon: 'sleep' },
];

// ---------- the guide ----------
export const GUIDE = [
  {
    id: 'how', title: 'How the 12 weeks work',
    body: `<p>Three phases of four weeks: <b>Foundation</b>, <b>Build</b> and <b>Sculpt</b>. Each week has four workouts, about 35–40 minutes each. Every workout goes the same way: a 5-minute warm-up, four lower-body moves, two core moves, then a short cool-down.</p>
<p>The plan doesn’t care about dates. It only moves forward when you finish a workout, so a missed day never puts you behind. Just do the next one.</p>`,
  },
  {
    id: 'week', title: 'Your week',
    body: `<p>Any four days work. The easiest rhythm is two days on, one off, two on, two off. For example:</p>
<ul><li>Saturday: Day A</li><li>Sunday: Day B</li><li>Monday: rest</li><li>Tuesday: Day C</li><li>Wednesday: Day D</li><li>Thursday and Friday: rest</li></ul>
<p>Rest days still count. That’s when the muscle actually gets built. A walk on rest days is a great idea.</p>`,
  },
  {
    id: 'effort', title: 'How hard should it feel?',
    body: `<p>Finish each set knowing you could have done a few more good reps. That number shrinks as you go:</p>
<ul><li>Foundation: about 3 reps left</li><li>Build: about 2 reps left</li><li>Sculpt: 1–2 reps left</li></ul>
<p>“Good reps” means slow, controlled and with the squeeze. If the form gets messy, the set is over.</p>`,
  },
  {
    id: 'read', title: 'Reading the plan',
    body: `<ul>
<li><b>3 × 12</b> means 3 sets of 12 reps.</li>
<li><b>/ leg</b> or <b>/ side</b> means that many on each side. Do one side, then the other, then rest.</li>
<li><b>Tempo</b> is how fast you move. “Lower in 3 seconds” matters more than it sounds; slow lowering is how bodyweight work stays hard.</li>
<li><b>1.5 reps</b>: go all the way down, come halfway up, go back down, then all the way up. That’s one rep.</li>
<li><b>Pulses</b>: small, quick movements in the hardest part of the range, right after the last full rep.</li>
</ul>`,
  },
  {
    id: 'progress', title: 'When to make it harder',
    body: `<p>When you can do the top of the rep range on every set with clean form, it’s time to level up. Use the “harder” option on that exercise, add a pause, or slow the lowering down.</p>
<p>If a move hurts a joint (not muscle burn, actual pain), use the “easier” option instead. Muscle burn is fine. Sharp pain is a stop sign.</p>`,
  },
  {
    id: 'sore', title: 'Soreness and recovery',
    body: `<p>Week 1 will probably make your legs sore for a day or two. That’s normal and it gets much less after the first couple of weeks. Walking, a warm shower and sleep help. Soreness isn’t a sign of a good workout, so don’t chase it.</p>`,
  },
  {
    id: 'glutes', title: 'Rounder glutes, honestly',
    body: `<p>Glutes grow from three things together: hard sets that get harder over time, enough protein, and sleep. The plan handles the first one. Shape changes usually show between weeks 8 and 12, which is why check-ins and photos matter more than the mirror on a random Tuesday.</p>
<p>Take a photo from the side and back at the start, at week 6 and at week 12: same light, same clothes, same spot.</p>`,
  },
  {
    id: 'stomach', title: 'A flatter stomach, honestly',
    body: `<p>No exercise burns fat from one spot. A flatter stomach comes from three levers:</p>
<ul><li><b>A little less fat overall.</b> Protein at every meal, daily steps, and no crash diets.</li>
<li><b>A strong deep core.</b> Dead bugs, planks and belly breathing train the muscles that hold your stomach in.</li>
<li><b>Less bloating.</b> Eat a bit slower, drink water, add fibre gradually, fewer fizzy drinks.</li></ul>
<p>Standing tall helps more than people expect. That’s a side effect of strong glutes and core.</p>`,
  },
  {
    id: 'habits', title: 'The habits doing quiet work',
    body: `<ul>
<li><b>Steps:</b> 7,000 or more a day. Walking is the easiest fat-loss tool there is.</li>
<li><b>Protein:</b> roughly 80–100 g a day, which is about a palm-sized portion at every meal. Eggs, chicken, fish, meat, laban or yogurt, cheese, lentils and chickpeas all count.</li>
<li><b>Water:</b> 8 or more glasses, more in summer.</li>
<li><b>Sleep:</b> 7 hours or more. Muscle is built while you sleep.</li>
</ul>
<p>Tick them on the Today screen. They’re for you, not a test.</p>`,
  },
  {
    id: 'safety', title: 'Safety notes',
    body: `<ul>
<li>Always do the warm-up.</li>
<li>Push the couch against a wall before hip thrusts or split squats on it.</li>
<li>Use the bottom stair for step-ups, never a chair that can tip.</li>
<li>For sliding curls, use socks or a towel on a smooth floor, not a rug.</li>
<li>If something hurts in a joint, stop and use the easier option.</li>
</ul>`,
  },
  {
    id: 'period', title: 'Period days',
    body: `<p>Turn on <b>Period Mode</b> from the top of the screen on days you don’t feel like training. The plan pauses with zero guilt, and you get a gentle 12-minute flow, a breathing timer and a comfort checklist instead.</p>
<p>If you feel fine, you can train as normal. Some people even find light movement eases cramps. Your body, your call.</p>`,
  },
];
