---
title: "Synth1 Unofficial Manual"
layout: post
tags: [Programming Projects for Advanced Beginners]
og_image: https://robertheaton.com/images/robot-army-cover.png
published: false
---

* How do I turn off Oscillator 1? (Mix knob)
Include how to install on OSX


<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1396 1018" >
  <image width="1396" height="1018" xlink:href="/images/synth1-main.png">
  </image>
  <a xlink:href="#osc1waveform">
    <rect x="30" y="112" fill="#fff" opacity="0" width="206" height="94" />
  </a>
  <a xlink:href="#osc1detune">
    <rect x="238" y="116" fill="#fff" opacity="0" width="68" height="94" />
  </a>
  <a xlink:href="#osc1fm">
    <rect x="308" y="116" fill="#fff" opacity="0" width="68" height="94" />
  </a>
  <a xlink:href="#osc1suboscamp">
    <rect x="372" y="100" fill="#fff" opacity="0" width="68" height="86" />
  </a>
  <a xlink:href="#osc1suboscwaveform">
    <rect x="440" y="100" fill="#fff" opacity="0" width="140" height="86" />
  </a>
  <a xlink:href="#osc1suboscoct">
    <rect x="372" y="186" fill="#fff" opacity="0" width="208" height="26" />
  </a>
  <a xlink:href="#osc2waveform">
    <rect x="32" y="226" fill="#fff" opacity="0" width="206" height="78" />
  </a>
  <a xlink:href="#osc2ringmod">
    <rect x="238" y="226" fill="#fff" opacity="0" width="102" height="78" />
  </a>
  <a xlink:href="#osc2sync">
    <rect x="340" y="226" fill="#fff" opacity="0" width="102" height="78" />
  </a>
  <a xlink:href="#osc2keytrack">
    <rect x="32" y="304" fill="#fff" opacity="0" width="142" height="62" />
  </a>
  <a xlink:href="#osc2pitch">
    <rect x="174" y="304" fill="#fff" opacity="0" width="120" height="62" />
  </a>
  <a xlink:href="#osc2finepitch">
    <rect x="294" y="304" fill="#fff" opacity="0" width="146" height="62" />
  </a>
  <a xlink:href="#menvtoggle">
    <rect x="32" y="368" fill="#fff" opacity="0" width="146" height="68" />
  </a>
  <a xlink:href="#menvattack">
    <rect x="178" y="368" fill="#fff" opacity="0" width="80" height="74" />
  </a>
  <a xlink:href="#menvdecay">
    <rect x="258" y="368" fill="#fff" opacity="0" width="80" height="74" />
  </a>
  <a xlink:href="#menvamount">
    <rect x="338" y="368" fill="#fff" opacity="0" width="110" height="74" />
  </a>

  <a xlink:href="#menvdest">
    <rect x="32" y="442" fill="#fff" opacity="0" width="416" height="46" />
  </a>
  <a xlink:href="#oscskeyshift">
    <rect x="450" y="224" fill="#fff" opacity="0" width="132" height="84" />
  </a>
  <a xlink:href="#oscsmix">
    <rect x="450" y="308" fill="#fff" opacity="0" width="66" height="82" />
  </a>



</svg>

### <a href="#osc1waveform" name="osc1waveform">Oscillator 1: waveform</a>

Sets the waveform of oscillator 1. Can be:
* Sine
* Triangle
* Saw
* Square

### <a href="#osc1detune" name="osc1detune">Oscillator 1: detune</a>

Detunes oscillator 1. If non-zero, the oscillator signal is split in two; one half is detuned down, the other half is detuned up. This gives the sound a fatter quality. In some other synths (like the ES2) you would produce this effect by having two separate oscillators and manually detuning one up and one down.

This setting does not affect Oscillator 2.

### <a href="#osc1fm" name="osc1fm">Oscillator 1: FM</a>

Enable frequency modulation (FM). Oscillator 1 is modulated by oscillator 2; 1 is the "carrier", and 2 is the "modulator". FM therefore changes the form of oscillator 1, but not oscillator 2.

Note that even when FM is enabled, oscillator 2 continues to produce sound, as well as modulate oscillator 1. If you only want oscillator 2 to act as a modulator, and to not appear in the mix itself, set the mix knob to 100:0.

## <a href="#osc1sub" name="osc1sub">Oscillator 1 sub-oscillator</a>

The sub-oscillator is a separate oscillator that plays alongside oscillator 1, either the same note or an octave below. When the sub-oscillator is adjusted, the Synth1 adjusts the combined amplitude of oscillator 1 and the sub-oscillator to remain constant. So the sub-oscillator can make your sound richer or fatter, but it can't generally make it louder. The sub-oscillator is passed through the same effects as oscillator 1, so it is affected by the FM and detune knobs, as well as unison. Zoran Nikolic notes that the sub-oscillator does *not* influence ring/AM modulation, however.

### <a href="#osc1suboscamp" name="osc1suboscamp">Oscillator 1 sub-oscillator: amplitude</a>

Sets the amplitude of oscillator 1's sub-oscillator. The sub-oscillator plays alongside the main oscillator 1.

### <a href="#osc1suboscwaveform" name="osc1suboscwaveform">Oscillator 1 sub-oscillator: waveform</a>

Sets the waveform of the sub-oscillator. Just like the main oscillator 1, this can be:

* Sine
* Triangle
* Saw
* Square

### <a href="#osc1suboscoct" name="osc1suboscoct">Oscillator 1 sub-oscillator: octave</a>

Sets whether the sub-oscillator plays at the same octave as oscillator 1 (0oct), or an octave below (-1oct).

### <a href="#osc2waveform" name="osc2waveform">Oscillator 2: waveform</a>

Sets the waveform of oscillator 2. Can be:

* Triangle
* Saw
* Square
* Noise

These are the same options as oscillator 1, but with the sine wave replaced with noise. Zoran Nikolic makes some interesting observations about the subtleties of the noise wave:

> With Noise selected, Oscillator 2 produces noise (useful for vintage, ambient FX or percussion sounds) rather than a pitched waveform. Note that the color of noise can not be changed directly via pitch knob (or any other like track, fine or key shift). For this you can use the other parameters, such as, for example, the filter setting s (a s for all other sound from the Synth1 ). In this case, the further you turn the frq knob clockwise, the brighter the noise will be. All the way to the right, its frequency characteristic is very close to that of white noise (where all frequencies are represented with equal energy). 
>
> If Sync is activated (see below), selecting Noise will produce very special signals with non - transposed formant spectrum with strong "body resonance" characteristics. The reason 'synced noise' works at all is that it's the same series of frequencies that are synced (repeated over and over). In a traditional analog system this function wouldn't work since the noise is totally random. Please note that the noise is not affected by LFOs, Modulation Envelope or e.g. Modulation Wheel, even when these have Oscillator 2 selected as modulation destination. 

### <a href="#osc2ringmod" name="osc2ringmod">Oscillator 2: ring modulation</a>

Toggles ring modulation, also known as amplitude modulation (AM). Zoran Nikolic notes:

> When trying out Ring Modulation, make sure you listen to Oscillator 2, since it is mainly this that is affected by the timbre changes! Turning the Oscillator 2 pitch knob will change the timbre, much as with FM. However, with Ring Modulation, this will also affect the pitch of the sound! This means that activating Ring Modulation may result in a sound with a completely different pitch than the "normal" sounds . 

He also points out that when ring modulation is activated, you can't use frequency modulation.

### <a href="#osc2sync" name="osc2sync">Oscillator 2: sync</a>

Toggles sync mode. When enabled, oscillator 2 is synchronized with oscillator 1, and its waveform is retriggered from its beginning whenever oscillator 1 completes a cycle. This affects oscillator 2, without changing oscillator 1.

### <a href="#osc2keytrack" name="osc2keytrack">Oscillator 2: keyboard track</a>

Toggles keyboard track mode. When enabled, oscillator 2's pitch changes as you play different notes. When disabled, oscillator 2 always plays the same pitch, which can be set using the pitch knob.

Editor's note: you probably want this feature enabled the vast majority of the time.

### <a href="#osc2pitch" name="osc2pitch">Oscillator 2: pitch</a>

Shifts the pitch of oscillator 2 up or down by intervals of a whole semi-tone.

### <a href="#osc2finepitch" name="osc2finepitch">Oscillator 2: fine pitch</a>

Shifts the pitch of oscillator 2 up or down by intervals of "cents" - hundredths of a semi-tone

### <a href="#menvtoggle" name="menvtoggle">Modulation envelope: toggle</a>

Toggles the modulation envelope (m.env). The modulation envelope is effective an ADSR envelope with sustain locked to 0, so all you get to control is A and D. It is always retriggered with every key press, even in legato mode (TODO: maybe?)

### <a href="#menvattack" name="menvattack">Modulation envelope: attack</a>

Adjusts the modulation envelope attack time. Functions like a normal ADSR attack knob.

### <a href="#menvdecay" name="menvdecay">Modulation envelope: decay</a>

Adjusts the modulation envelope attack time. Functions like a normal ADSR decay knob.

### <a href="#menvamount" name="menvamount">Modulation envelope: amount</a>

Adjusts how much the envelope modulates its target. Setting it to 0 is equivalent to disabling the modulation envelope altogether.

### <a href="#menvdest" name="menvdest">Modulation envelope: destination</a>

Sets the target parameter that the envelope will modulate. Can be:

* `osc2`: oscillator 2 pitch
* `FM`: oscillator 1 FM
* `p/w`: both oscillator's pulse-width[LINK]

### <a href="#oscskeyshift" name="oscskeyshift">Oscillators: key shift</a>

Shift the pitch of the entire synth by semi-tone intervals.

### <a href="#oscsmix" name="oscsmix">Oscillators: mix</a>

Adjusts the balance between oscillators 1 and 2. Hard left is 100% oscillator 1, 0% oscillator 2. Hard right is the opposite.

### Oscillator p/w
If either oscillator is set to a pulse/square wave, adjusts the width of the pulse. Does nothing if neither oscillator is a pulse/square wave.
### Oscillator phase
Sets and adjusts a fixed phase shift between oscillators 1 and 2. With the knob set to 0, the phase shift between them is not fixed at all. Zoran Nikolic notes that if you change this parameter then you need to press a new key in order to hear the change in effect.
### Oscillator fine tune
Shifts the pitch of both oscillators 1 and 2 up or down by intervals of "cents" - hundredths of a semi-tone. Unlike oscillator 1's detune knob, this adjusts the central pitch of the instrument that our ear interprets. To add width to a sound whilst maintaining the same pitch, use multiple Synth1s with fine tunings that average out to 0.
### Amplifier ADSR
Adjusts the standard ADSR envelope of the output volume.
### Amplifier gain
Adjusts the overall volume of the instrument
### Amplifier velocity
Adjusts how much the volume is affected by the velocity with which a key is pressed. If set to 0, the same volume is played, no matter how hard or soft the key was pressed.
# Filter
Standard filter, ADSR to affect the threshold
### Filter ADSR
Adjusts the standard ADSR envelope of the filter.
### Filter amount
Adjusts how much the filter envelope affects the filter's threshold frequency.
### Filter frequency threshold
Adjusts the "resting" value of the filter frequency threshold, when it is not being modulated by the ADST envelope.
### Filter resonance
Adjusts the resonance of the filter. Resonance amplifies the frequencies around the threshold frequency.
### Filter saturation
Adjusts the saturation of the filter. Filter saturation produces a bright, distorted sound.
### Filter keyboard track
Adjusts whether and how much the filter threshold frequency increases with the pitch of the note being played. Higher-pitched notes naturally contain higher frequency sounds. A threshold frequency that is appropriate for damping a low note's highest frequencies may cut and dull almost all those of a high note. The filter keyboard track allows you to mitigate this effect.
### Filter velocity response
Toggles whether the filter threshold is affected by the velocity with which a note is played. Unlike the velocity response for amplitude[LINK], the size of the effect is fixed by the Synth1, and can't be changed.
### Filter type
Sets the type of the filter. Can be:
* LP12 - Low pass with 12dB (shallow) rolloff
* LP24 - Low pass with 24dB (steep) rolloff
* HP12 - High pass with 12dB rolloff
* BP12 - Band pass with 12db rolloff
A filter's "rolloff" indicates how quickly it decreases frequencies after passing the threshold frequency. A shallow rolloff lets through more frequencies after the threshold frequency has been passed, whereas a steep one cuts them much harder.
# Effect
Choose from X different effect types. If you want more than one, use an external FX module.
### Effect on/off
Toggles the effect on and off.
### Effect type
Sets the effect type. Can be:
* `a.d.1` - Analog Distortion 1 - "even-order harmonic distortion"
* `a.d.2` - Analog Distortion 2 - soft clips the signal, can produce warm overdrive sounds
* `d.d` - Digital Distortion - "high-resolution digital distortion", can produce "bold and modern" distorted sounds
* `deci` - Bit Crusher - "low-resolution digital distortion", can emulate the sound of early digital audio
* `ph.1`, `ph.2`, `ph.3`, `ph.4` - Phaser - one-, two-, four-, and six-stage phasers respectively
* `r.m.` - Ring Modulation / AM - performs ring modulation by combining the input signal with its own, inbuilt oscillator
* `comp` - Compressor - simple compressor
Above descriptions mostly taken directly from Zoran Nikolic.
### Effect controls 1+2 and effect level/mix
[TODO: table]
# Equalizer / Pan
3 separate pieces - bandwidth thing, HP/LP filter, pan.
Use noise and pass through EQ analyzer to fiddle more
### EQ band frequency
Adjusts the central frequency of the EQ band.
### EQ band amount
Adjusts how much the EQ band boosts or cuts its target frequency range. When set to the middle value (+0.0dB), the EQ band is effectively disabled.
### EQ band Q
Adjusts the "Q" of the EQ band, which controls how wide the band is. A high value means a narrow band that only affects a small range of frequencies around the central frequency, a low value means a wide band.
### EQ tone
Adjusts the intensity of an independent high- or low-pass filter. It is not clear to me if it adjusts the rolloff (steepness), amount, or central frequency of the filter. I suspect it affects all three. Useful for slight tweaks to the color of the sound, but for any significant surgery use an external EQ module. When set to its central value of 64, the filter is effectively disabled.
### Pan L-R
Pans the output of the entire instrument to the left or right.
# Tempo Delay
Pretty standard delay
### Tempo Delay on/off
Toggles delay on or off
### Delay Type
Sets the type of delay. Can be:
* `ST` - Stereo - two mono delays, one for the left channel and one for the right. The left dry signal is fed into the left delay, the right signal in the right delay. If the input signal is mono then the output delay effect will appear as mono too.
* `X` - Cross-Feedback - like a stereo delay, but delay feedback is looped into the *opposite* delay channel to the channel that created it. This creates a bouncing effect.
* `PP` - Ping-Pong - two mono delays, but the dry signal is initially fed into only one of the delays. The feedback is looped into the *opposite* delay channel. This creates a more pronounced ping-pong effect than cross-feedback, since the bouncing effect is applied to the entire signal, not just the stereo elements of it.
### Delay Time
Adjusts the time delay between feedback cycles. All values are synced with the tempo, apart from shortest value, which is 0.1ms.
### Delay Time Spread
Adds additional delay to either the left or right channels. Produces a complex, asymmetric sound.
### Delay Feedback
Adjusts the fraction of the signal the delay unit should feed back into itself on each cycle. Controls how quickly the delay effect decays.
### Delay Tone
A simple high- or low-pass filter that is applied to the delayed signal. Works in the same way as the EQ Tone knob[LINK].
### Delay dry/wet
Adjusts the balance between the input signal (dry) and the delayed output signal (wet). Turning it all the way to the left (0%) cuts out the delay entirely, turning it all the way to the right (100%) cuts out the input signal entirely.
# Chorus/Flanger
https://www.izotope.com/en/blog/music-production/understanding-chorus-flangers-and-phasers-in-audio-production.html
### Chorus on/off
Toggles chorus/flange on or off.
### Chorus type
Sets the number of copies of the input signal that the chorus unit will make.
### Chorus delay time
Adjusts the central phase delay between the copies of the input signal. Short values produce a tighter, flanger sound. Long values produce a broader, chorus sound.
### Chorus depth
Adjusts the amount that the LFO affects the phase delay between the input signal and its copies. High values give a more pronounced movement. Low values give a more subtle one. A value of zero means that the phase delay remains constant, and the sound does not change over time.
### Chorus rate
Adjusts the rate at which the LFO affects the phase delay between the input signal and its copies. Affects the rate of movement of the sound.
### Chorus feedback
Adjusts the amount that the chorus output should be fed back into the unit to produce a range of resonances and odd effects. The effects can be somewhat unpredictable.
### Chorus level
Adjusts the volume of the copies of the input signal. A value of 0 effectively disables the chorus unit.
# Voice
### Voice play mode
Sets how the synthesizer responds to multiple notes being played at the same time. Can be:
* `poly` - polyphonic - the synthesizer will output multiple notes simultaneously
* `mono` - monophonic - the synthesizer will only ever output a single note at a time. If a second key is pressed whilst a first key is still held down, the synthesizer will stop playing the first note and retrigger with the second note. The volume and filter envelopes will restart from the beginning. If the second key is released while the first is still held down, it will similarly retrigger the first note.
* `legator` - legato - same as `mono` mode, but envelopes are not retriggered until all notes have been released.
### Voice polyphony
Sets how many notes the synthesizer will output simultaneously in `poly` mode. If you hold down more keys than the polyphony number, the notes of the first keys that you pressed will be stopped.
Has no effect in `mono` or `legato` modes.
### Voice portamento
Adjusts how long it takes to slide between notes. Set to 0 if you don't want any slide.
### Portamento auto mode on/off
Toggles portamento auto mode. When enabled, the synthesizer only slides between notes if you play legato and press a second note before releasing the first. According to Zoran Nikolic:
"The effect of Auto Portamento is pretty obvious when you have selected Mono or Legato Play Mode. If, on the other hand, Poly mode is selected, the Portamento effect will be slightly unpredictable if Auto is on. Therefore, turning off Auto in Poly mode is recommended."
### Unison on/off
Toggles unison mode on or off.
### Unison voice count
Sets the number of unison voices.
### Unison detune
Adjusts the amount that the unison-ed voices are detuned by. Creates a broader, fatter sound.
### Unison phase
Adjusts the phase shift between the input signal and the unison-ed voices. Has no effect unless you fix the phase of oscillators using the oscillator phase knob[LINK]. Zoran Nikolic notes:
"To hear the changes in effect, after each change in value you should press the key again."
### Unison spread
Adjusts the stereo spread of the unison-ed voices, panning some left and some right to produce a wide, lush, symmetrical sound. According to Zoran Nikolic:
"Use this to get a wide unison voices stereo image, with the emphasis on the left (negative settings) or the right (positive settings)"
However, I personally hear very little difference between very positive and very negative values.
### Unison pitch
Adjusts the pitch of the unison-ed voices, relative to the root voice.
# Arpeggiator
### Arpeggiator on/off
Toggles the arpeggiator on or off.
### Arpeggiator pattern
Sets the arpeggiator pattern. Can be:
* `updown` - ascends and descends the notes in the chord. Does not repeat the top or bottom notes
* `up` - ascends the notes in the chord
* `down` - descends the notes in the chord
* `random` - plays random notes in the chord. May replay a note before having played all the others.
### Arpeggiator range
Sets the range of the arpeggiator in octaves. The arpeggiator will repeat the chord pattern for this many octaves before starting again.
### Arpeggiator beat
Adjusts the speed of the arpeggiator.
### Arpeggiator gate
Adjusts the length of the notes played by the arpeggiator. If set to 0 then no sound is played.
# LFO
### LFO 1/2 on/off
Toggles the corresponding LFO on or off.
### LFO 1/2 pattern
Sets the pattern of the corresponding LFO. Can be:
* Sawtooth
* Square
* Triangle
* Sine
* Stepped random
* Smoothed random
### LFO 1/2 speed
Adjusts the speed of the corresponding LFO. Values are synced to track tempo if the tempo sync[LINK] button is enabled, and unsynced otherwise.
### LFO 1/2 amount
Adjusts the depth of the corresponding LFO; how much the target is modulated by the oscillator.
### LFO 1/2 destination
Sets the destination of the corresponding LFO - which parameter is modulated by the LFO. Can be:
* `osc2` - the pitch of oscillator 2
* `osc1,2` - the pitch of oscillators 1 and 2
* `filter` - the cutoff frequency[LINK] of the filter 
* `amp` - the amplitude[LINK] of the instrument
* `p/w` - the pulse width[LINK] of oscillators 1 and 2
* `FM` - the FM[LINK] of oscillator 1
* `pan` - the pan direction of the instrument
# MIDI controls

### Pitch bend range

Sets the range of the pitch bend wheel.

### MIDI control 1/2 source

Sets the source MIDI controller. Can be one of many options that I won't list here - click the Synth1 window to see the full list.

### MIDI control target parameter

Sets the parameter modulated by the MIDI controller. Can be one of many options that I won't list here - click the Synth1 window to see the full list.

### MIDI control 1/2 sensitivity

Sets how much, and in which direction, the target parameter is affected by the MIDI controller. 
