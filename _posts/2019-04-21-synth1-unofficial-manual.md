---
permalink: /2019/04/21/synth1-unofficial-manual/index.html
title: "Synth1: an unofficial manual"
layout: post
tags: [Music]
og_image: https://robertheaton.com/images/synth1-main.png
---

<style>
table {
text-align: left;
}
table, th, td {
border: 1px solid black;
}
</style>

The Synth1 is one of the most popular software synthesizers of all time. However, to the best of my knowledge it has no manual. A gentleman called Zoran Nikolic put together [an unofficial PDF][zn] a decade or so ago, which you should absolutely read, but I believe that this is the first and only explanation of how the Synth1 works that you can click on and easily interact with.

This manual does not attempt to explain synthesizer fundamentals. Instead, it assumes some familiarity with the common components of most synthesizers (ADSRs, filters, LFOs, etc) and explains how they are used an implemented in the Synth1.

Click on a knob or button to read an explanation of what it does.

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
  <a xlink:href="#oscspw">
    <rect x="516" y="308" fill="#fff" opacity="0" width="66" height="142" />
  </a>
  <a xlink:href="#oscsphase">
    <rect x="450" y="390" fill="#fff" opacity="0" width="66" height="102" />
  </a>
  <a xlink:href="#oscsfinetune">
    <rect x="516" y="390" fill="#fff" opacity="0" width="66" height="102" />
  </a>
  <a xlink:href="#ampadsr">
    <rect x="590" y="106" fill="#fff" opacity="0" width="232" height="92" />
  </a>
  <a xlink:href="#ampgain">
    <rect x="822" y="106" fill="#fff" opacity="0" width="68" height="92" />
  </a>
  <a xlink:href="#ampvel">
    <rect x="890" y="106" fill="#fff" opacity="0" width="68" height="92" />
  </a>
  <a xlink:href="#filteradsr">
    <rect x="590" y="274" fill="#fff" opacity="0" width="240" height="92" />
  </a>
  <a xlink:href="#filteramount">
    <rect x="830" y="274" fill="#fff" opacity="0" width="62" height="92" />
  </a>
  <a xlink:href="#filterfreq">
    <rect x="590" y="366" fill="#fff" opacity="0" width="60" height="104" />
  </a>
  <a xlink:href="#filterres">
    <rect x="650" y="366" fill="#fff" opacity="0" width="56" height="104" />
  </a>
  <a xlink:href="#filtersat">
    <rect x="706" y="366" fill="#fff" opacity="0" width="56" height="104" />
  </a>
  <a xlink:href="#filterkbd">
    <rect x="762" y="366" fill="#fff" opacity="0" width="54" height="104" />
  </a>
  <a xlink:href="#filtervel">
    <rect x="816" y="366" fill="#fff" opacity="0" width="56" height="104" />
  </a>
  <a xlink:href="#filtertype">
    <rect x="872" y="274" fill="#fff" opacity="0" width="122" height="220" />
  </a>
  <a xlink:href="#effecttoggle">
    <rect x="994" y="100" fill="#fff" opacity="0" width="66" height="78" />
  </a>
  <a xlink:href="#effecttype">
    <rect x="1060" y="100" fill="#fff" opacity="0" width="100" height="78" />
  </a>
  <a xlink:href="#effectcontrols">
    <rect x="1160" y="100" fill="#fff" opacity="0" width="190" height="78" />
  </a>
  <a xlink:href="#eqfreq">
    <rect x="998" y="214" fill="#fff" opacity="0" width="70" height="84" />
  </a>
  <a xlink:href="#eqamt">
    <rect x="1068" y="214" fill="#fff" opacity="0" width="72" height="84" />
  </a>
  <a xlink:href="#eqq">
    <rect x="1140" y="214" fill="#fff" opacity="0" width="64" height="84" />
  </a>
  <a xlink:href="#eqtone">
    <rect x="1204" y="214" fill="#fff" opacity="0" width="74" height="84" />
  </a>
  <a xlink:href="#pan">
    <rect x="1278" y="214" fill="#fff" opacity="0" width="76" height="84" />
  </a>
  <a xlink:href="#delaytoggle">
    <rect x="996" y="330" fill="#fff" opacity="0" width="62" height="86" />
  </a>
  <a xlink:href="#delaytype">
    <rect x="1058" y="330" fill="#fff" opacity="0" width="40" height="86" />
  </a>
  <a xlink:href="#delaytime">
    <rect x="1098" y="330" fill="#fff" opacity="0" width="56" height="86" />
  </a>
  <a xlink:href="#delayspread">
    <rect x="1154" y="330" fill="#fff" opacity="0" width="54" height="86" />
  </a>
  <a xlink:href="#delayfdbk">
    <rect x="1208" y="330" fill="#fff" opacity="0" width="54" height="86" />
  </a>
  <a xlink:href="#delaytone">
    <rect x="1262" y="330" fill="#fff" opacity="0" width="53" height="86" />
  </a>
  <a xlink:href="#delaydw">
    <rect x="1315" y="330" fill="#fff" opacity="0" width="58" height="86" />
  </a>
  <a xlink:href="#delaydw">
    <rect x="1315" y="330" fill="#fff" opacity="0" width="58" height="86" />
  </a>
  <a xlink:href="#chorustoggle">
    <rect x="996" y="446" fill="#fff" opacity="0" width="62" height="87" />
  </a>
  <a xlink:href="#chorustype">
    <rect x="1058" y="446" fill="#fff" opacity="0" width="40" height="87" />
  </a>
  <a xlink:href="#chorustime">
    <rect x="1098" y="446" fill="#fff" opacity="0" width="56" height="87" />
  </a>
  <a xlink:href="#chorusdepth">
    <rect x="1154" y="446" fill="#fff" opacity="0" width="54" height="87" />
  </a>
  <a xlink:href="#chorusrate">
    <rect x="1208" y="446" fill="#fff" opacity="0" width="54" height="87" />
  </a>
  <a xlink:href="#chorusfdbk">
    <rect x="1262" y="446" fill="#fff" opacity="0" width="53" height="87" />
  </a>
  <a xlink:href="#choruslevel">
    <rect x="1315" y="446" fill="#fff" opacity="0" width="58" height="87" />
  </a>
  <a xlink:href="#voicemode">
    <rect x="997" y="569" fill="#fff" opacity="0" width="162" height="95" />
  </a>
  <a xlink:href="#voicepoly">
    <rect x="1159" y="569" fill="#fff" opacity="0" width="194" height="95" />
  </a>
  <a xlink:href="#portamount">
    <rect x="1159" y="668" fill="#fff" opacity="0" width="62" height="89" />
  </a>
  <a xlink:href="#portauto">
    <rect x="1223" y="668" fill="#fff" opacity="0" width="130" height="89" />
  </a>
  <a xlink:href="#unisontoggle">
    <rect x="997" y="668" fill="#fff" opacity="0" width="160" height="89" />
  </a>
  <a xlink:href="#unisonvoice">
    <rect x="997" y="757" fill="#fff" opacity="0" width="85" height="92" />
  </a>
  <a xlink:href="#unisondetune">
    <rect x="1082" y="757" fill="#fff" opacity="0" width="64" height="92" />
  </a>
  <a xlink:href="#unisonphase">
    <rect x="1146" y="757" fill="#fff" opacity="0" width="80" height="92" />
  </a>
  <a xlink:href="#unisonspread">
    <rect x="1226" y="757" fill="#fff" opacity="0" width="63" height="92" />
  </a>
  <a xlink:href="#unisonpitch">
    <rect x="1289" y="757" fill="#fff" opacity="0" width="67" height="92" />
  </a>
  <a xlink:href="#arptoggle">
    <rect x="589" y="535" fill="#fff" opacity="0" width="65" height="67" />
  </a>
  <a xlink:href="#arppattern">
    <rect x="654" y="535" fill="#fff" opacity="0" width="138" height="189" />
  </a>
  <a xlink:href="#arprange">
    <rect x="792" y="535" fill="#fff" opacity="0" width="110" height="189" />
  </a>
  <a xlink:href="#arpbeat">
    <rect x="902" y="535" fill="#fff" opacity="0" width="69" height="97" />
  </a>
  <a xlink:href="#arpgate">
    <rect x="902" y="629" fill="#fff" opacity="0" width="69" height="95" />
  </a>


  <a xlink:href="#lfotoggle">
    <rect x="33" y="536" fill="#fff" opacity="0" width="61" height="61" />
  </a>
  <a xlink:href="#lfopattern">
    <rect x="94" y="536" fill="#fff" opacity="0" width="63" height="61" />
  </a>
  <a xlink:href="#lfospeed">
    <rect x="33" y="597" fill="#fff" opacity="0" width="67" height="61" />
  </a>
  <a xlink:href="#lfoamount">
    <rect x="135" y="597" fill="#fff" opacity="0" width="89" height="57" />
  </a>
  <a xlink:href="#lfodest">
    <rect x="157" y="536" fill="#fff" opacity="0" width="67" height="61" />
  </a>
  <a xlink:href="#lfotemposync">
    <rect x="33" y="654" fill="#fff" opacity="0" width="110" height="84" />
  </a>
  <a xlink:href="#lfokeysync">
    <rect x="143" y="654" fill="#fff" opacity="0" width="81" height="84" />
  </a>


  <a xlink:href="#lfotoggle">
    <rect x="378" y="536" fill="#fff" opacity="0" width="61" height="61" />
  </a>
  <a xlink:href="#lfopattern">
    <rect x="439" y="536" fill="#fff" opacity="0" width="63" height="61" />
  </a>
  <a xlink:href="#lfospeed">
    <rect x="378" y="597" fill="#fff" opacity="0" width="67" height="61" />
  </a>
  <a xlink:href="#lfoamount">
    <rect x="480" y="597" fill="#fff" opacity="0" width="89" height="57" />
  </a>
  <a xlink:href="#lfodest">
    <rect x="502" y="536" fill="#fff" opacity="0" width="67" height="61" />
  </a>
  <a xlink:href="#lfotemposync">
    <rect x="378" y="654" fill="#fff" opacity="0" width="110" height="84" />
  </a>
  <a xlink:href="#lfokeysync">
    <rect x="488" y="654" fill="#fff" opacity="0" width="81" height="84" />
  </a>

  <a xlink:href="#lfodest">
    <rect x="224" y="536" fill="#fff" opacity="0" width="157" height="217" />
  </a>

  <a xlink:href="#pbrange">
    <rect x="30" y="790" fill="#fff" opacity="0" width="244" height="72" />
  </a>
  <a xlink:href="#midisource">
    <rect x="274" y="760" fill="#fff" opacity="0" width="322" height="102" />
  </a>
  <a xlink:href="#miditarget">
    <rect x="768" y="760" fill="#fff" opacity="0" width="204" height="102" />
  </a>
  <a xlink:href="#midisens">
    <rect x="596" y="760" fill="#fff" opacity="0" width="172" height="102" />
  </a>


</svg>

## Oscillator 1

### <a href="#osc1waveform" name="osc1waveform">Oscillator 1: waveform</a>

Sets the waveform of oscillator 1. Can be:
* Sine
* Triangle
* Saw
* Square

### <a href="#osc1detune" name="osc1detune">Oscillator 1: detune</a>

Detunes oscillator 1. If non-zero, oscillator 1's signal is split in two. One half is detuned up, the other half is detuned down. This gives the oscillator sound a fatter quality. In some other synths (like the ES2) you would produce this effect by creating two separate oscillators and manually detuning one up and one down.

This setting does not affect Oscillator 2.

### <a href="#osc1fm" name="osc1fm">Oscillator 1: FM</a>

Enables and adjusts frequency modulation (FM). On the Synth1, oscillator 1 is modulated by oscillator 2, meaning that 1 is the "carrier" and 2 is the "modulator". FM therefore changes the sound of oscillator 1, but not oscillator 2.

Note that even when FM is enabled, oscillator 2 continues to produce sound, as well as modulate oscillator 1. If you want oscillator 2 to act as a modulator only, and to not play in the mix itself, set the [mix knob](#oscsmix) to 100:0.

## Oscillator 1 sub-oscillator

The sub-oscillator is a separate oscillator that plays alongside oscillator 1, either at the same pitch or an octave below. When the sub-oscillator volume is adjusted, the Synth1 adjusts the combined volume of oscillator 1 and the sub-oscillator to remain constant. This means that the sub-oscillator can make your sound richer or fatter, but it can't generally make it louder. The sub-oscillator is passed through the same effects as oscillator 1, so it is affected by the FM and detune knobs, as well as unison. [Zoran Nikolic][zn] notes that the sub-oscillator does *not* influence ring/AM modulation, however.

### <a href="#osc1suboscamp" name="osc1suboscamp">Oscillator 1 sub-oscillator: amplitude</a>

Sets the amplitude of oscillator 1's sub-oscillator. As described above, the sub-oscillator plays alongside the main oscillator 1.

### <a href="#osc1suboscwaveform" name="osc1suboscwaveform">Oscillator 1 sub-oscillator: waveform</a>

Sets the waveform of the sub-oscillator. This can be:

* Sine
* Triangle
* Saw
* Square

### <a href="#osc1suboscoct" name="osc1suboscoct">Oscillator 1 sub-oscillator: octave</a>

Sets whether the sub-oscillator plays at the same pitch as oscillator 1 (0oct), or an octave below (-1oct).

## Oscillator 2

### <a href="#osc2waveform" name="osc2waveform">Oscillator 2: waveform</a>

Sets the waveform of oscillator 2. Can be:

* Triangle
* Saw
* Square
* Noise

These are the same options as oscillator 1, but with noise instead of a sine wave. [Zoran Nikolic][zn] makes some interesting observations about the subtleties of the noise wave:

> With Noise selected, Oscillator 2 produces noise (useful for vintage, ambient FX or percussion sounds) rather than a pitched waveform. Note that the color of noise can not be changed directly via pitch knob (or any other like track, fine or key shift). For this you can use the other parameters, such as, for example, the filter setting s (a s for all other sound from the Synth1 ). In this case, the further you turn the frq knob clockwise, the brighter the noise will be. All the way to the right, its frequency characteristic is very close to that of white noise (where all frequencies are represented with equal energy). 
>
> If Sync is activated (see below), selecting Noise will produce very special signals with non - transposed formant spectrum with strong "body resonance" characteristics. The reason 'synced noise' works at all is that it's the same series of frequencies that are synced (repeated over and over). In a traditional analog system this function wouldn't work since the noise is totally random. Please note that the noise is not affected by LFOs, Modulation Envelope or e.g. Modulation Wheel, even when these have Oscillator 2 selected as modulation destination. 

### <a href="#osc2ringmod" name="osc2ringmod">Oscillator 2: ring modulation</a>

Toggles ring modulation, also known as amplitude modulation (AM). [Zoran Nikolic][zn] notes:

> When trying out Ring Modulation, make sure you listen to Oscillator 2, since it is mainly this that is affected by the timbre changes! Turning the Oscillator 2 pitch knob will change the timbre, much as with FM. However, with Ring Modulation, this will also affect the pitch of the sound! This means that activating Ring Modulation may result in a sound with a completely different pitch than the "normal" sounds . 

He also points out that when ring modulation is activated, you can't use frequency modulation.

### <a href="#osc2sync" name="osc2sync">Oscillator 2: sync</a>

Toggles sync mode. When enabled, oscillator 2 is synchronized with oscillator 1, and its waveform is retriggered from its beginning whenever oscillator 1 completes a cycle. This affects oscillator 2, but does nothing to oscillator 1. Depending on the settings on the rest of the instrument, the effect can be anywhere from wild to negligible.

### <a href="#osc2keytrack" name="osc2keytrack">Oscillator 2: keyboard track</a>

Toggles keyboard track mode. When enabled, oscillator 2's pitch changes as you play different notes. When disabled, oscillator 2 always plays the same pitch, which can be set using the pitch knob.

Editor's note: you probably want this feature enabled the vast majority of the time.

### <a href="#osc2pitch" name="osc2pitch">Oscillator 2: pitch</a>

Shifts the pitch of oscillator 2 up or down by intervals of a semi-tone.

### <a href="#osc2finepitch" name="osc2finepitch">Oscillator 2: fine pitch</a>

Shifts the pitch of oscillator 2 up or down by intervals of "cents" - hundredths of a semi-tone

## Other oscillator settings

### <a href="#menvtoggle" name="menvtoggle">Modulation envelope: toggle</a>

Toggles the modulation envelope (`m.env`). The modulation envelope is effectively an ADSR envelope with sustain locked to 0, so all you get to control is A and D. It is always retriggered with every key press, even in legato mode.

### <a href="#menvattack" name="menvattack">Modulation envelope: attack</a>

Adjusts the modulation envelope attack time. Functions like a normal ADSR attack knob.

### <a href="#menvdecay" name="menvdecay">Modulation envelope: decay</a>

Adjusts the modulation envelope attack time. Functions like a normal ADSR decay knob.

### <a href="#menvamount" name="menvamount">Modulation envelope: amount</a>

Adjusts how much the envelope modulates its target. Setting it to 0 is equivalent to disabling the modulation envelope altogether.

### <a href="#menvdest" name="menvdest">Modulation envelope: destination</a>

Sets the target parameter that the envelope will modulate. This target can be:

* `osc2`: oscillator 2 pitch
* `FM`: oscillator 1 FM
* `p/w`: both oscillators' [pulse-widths](#oscspw)

### <a href="#oscskeyshift" name="oscskeyshift">Oscillators: key shift</a>

Shift the pitch of the entire instrument by semi-tone intervals.

### <a href="#oscsmix" name="oscsmix">Oscillators: mix</a>

Adjusts the volume balance between oscillators 1 and 2. Hard left is 100% oscillator 1, 0% oscillator 2. Hard right is the opposite.

### <a href="#oscspw" name="oscspw">Oscillator p/w</a>

If either oscillator 1 or 2 is set to a pulse/square wave, adjusts the width of the pulse. Does nothing if neither oscillator is a pulse/square wave.

### <a href="#oscsphase" name="oscsphase">Oscillator phase</a>

Sets and adjusts a fixed phase shift between oscillators 1 and 2. With the knob set to 0, the phase shift between them is entirely unfixed. [Zoran Nikolic][zn] notes that if you change this parameter then you need to press a new key in order to hear the change in effect.

### <a href="#oscsfinetune" name="oscsfinetune">Oscillator fine tune</a>

Shifts the pitch of both oscillators 1 and 2 up or down by intervals of "cents" - hundredths of a semi-tone. Unlike [oscillator 1's detune knob](#osc1detune), this adjusts the central pitch of the instrument that our ear interprets. To add width to a sound whilst maintaining the same overall pitch, use multiple Synth1s with fine tunings that average out to 0.

## Amplifier

### <a href="#ampadsr" name="ampadsr">Amplifier ADSR</a>

Adjusts the ADSR envelope of the output volume.

### <a href="#ampgain" name="ampgain">Amplifier gain</a>

Adjusts the overall volume of the instrument

### <a href="#ampvel" name="ampvel">Amplifier velocity</a>

Adjusts how much the volume is affected by the velocity with which a key is pressed. If set to 0, the same volume is played, no matter how hard or soft the key was pressed.

## Filter

The Synth1 has a standard filter, with low-, high-, and band-pass options, as well as ADSR envelope controls.

### <a href="#filteradsr" name="filteradsr">Filter ADSR</a>

Adjusts the ADSR envelope of the filter.

### <a href="#filteramount" name="filteramount">Filter amount</a>

Adjusts how much the filter envelope affects the filter's threshold frequency.

### <a href="#filterfreq" name="filterfreq">Filter frequency threshold</a>

Adjusts the "resting" value of the filter frequency threshold when it is not being modulated by the ADSR envelope.

### <a href="#filterres" name="filterres">Filter resonance</a>

Adjusts the resonance of the filter. Resonance amplifies the frequencies around the threshold frequency to add "bite" to the sound.

### <a href="#filtersat" name="filtersat">Filter saturation</a>

Adjusts the saturation of the filter. Filter saturation produces a bright, distorted sound.

### <a href="#filterkbd" name="filterkbd">Filter keyboard track</a>

Adjusts whether and how much the filter threshold frequency increases with the pitch of the note being played. Higher-pitched notes naturally contain higher frequency tones. A threshold frequency that gently damps a low note's high frequencies may cut and dull almost all frequencies of a high note. Filter keyboard track mode mitigates this effect by increasing the cutoff frequency for higher notes.

### <a href="#filtervel" name="filtervel">Filter velocity response</a>

Toggles whether the filter threshold is affected by the velocity with which a note is played. Unlike the [velocity response for amplitude](#ampvel), the size of the effect is fixed by the Synth1, and can't be changed.

### <a href="#filtertype" name="filtertype">Filter type</a>

Sets the type of the filter. Can be:

* LP12 - Low pass with 12dB (shallow) rolloff
* LP24 - Low pass with 24dB (steep) rolloff
* HP12 - High pass with 12dB rolloff
* BP12 - Band pass with 12db rolloff

A filter's "rolloff" indicates how quickly it decreases frequencies after passing the threshold frequency. A shallow rolloff lets through more frequencies after the threshold frequency has been passed, whereas a steep one cuts them much harder.

## Effects

Allows you to choose from 7 different effects, including several types of distortion, compression, and phasing. If you want fine-grained control or multiple effects, use external FX modules.

### <a href="#effecttoggle" name="effecttoggle">Effect on/off</a>

Toggles the effect on and off.

### <a href="#effecttype" name="effecttype">Effect type</a>

Sets the effect type. Can be:

* `a.d.1` - Analog Distortion 1 - "even-order harmonic distortion"
* `a.d.2` - Analog Distortion 2 - soft clips the signal, can produce warm overdrive sounds
* `d.d` - Digital Distortion - "high-resolution digital distortion", can produce "bold and modern" distorted sounds
* `deci` - Bit Crusher - "low-resolution digital distortion", can emulate the sound of early digital audio
* `ph.1`, `ph.2`, `ph.3`, `ph.4` - Phaser - one-, two-, four-, and six-stage phasers respectively
* `r.m.` - Ring Modulation / AM - performs ring modulation by combining the input signal with its own, inbuilt oscillator
* `comp` - Compressor - simple compressor

Above descriptions mostly taken directly from [Zoran Nikolic][zn].

### <a href="#effectcontrols" name="effectcontrols">Effect controls 1+2 and level/mix</a>

|Abbrevitation|Type|Control 1|Control 2|Level/mix|
|-------------|----|---------|---------|---------|
|`a.d.1`|Analog Distortion 1|Distortion amount|LPF cut-off|level|
|`a.d.2.`|Analog Distortion 2|Distortion amount|LPF cut-off|level|
|`d.d.`|Digital Distortion|Distortion amount|LPF cut-off|level|
|`deci.`|Bit Crusher/Decimator|Sample rate|Bit depth|mix|
|`r.m.`|Ring Mod/AM|Mod freq|None|Mix|
|`comp.`|Compression|Compression depth|Attack time|level|
|`ph.1`|1-stage Phaser|LFO depth|LFO freq|feedback|
|`ph.2`|2-stage Phaser|LFO depth|LFO freq|feedback|
|`ph.3`|4-stage Phaser|LFO depth|LFO freq|feedback|
|`ph.4`|6-stage Phaser|LFO depth|LFO freq|feedback|

Control info from [Zoran Nikolic][zn].

## Equalizer / Pan

### <a href="#eqfreq" name="eqfreq">EQ band frequency</a>

Adjusts the central frequency of the EQ band.

### <a href="#eqamt" name="eqamt">EQ band amount</a>

Adjusts how much the EQ band boosts or cuts its target frequency range. When set to the middle value (+0.0dB), the EQ band is effectively disabled.

### <a href="#eqq" name="eqq">EQ band Q</a>

Adjusts the "Q" of the EQ band, which controls how wide the band is. A high value means a narrow band that only affects a small range of frequencies around the central frequency, a low value means a wide band.

### <a href="#eqtone" name="eqtone">EQ tone</a>

Adjusts the intensity of an independent high- or low-pass filter. It is not clear to me if it adjusts the rolloff (steepness); amount; or central frequency of the filter. I suspect it affects all three. Useful for slight tweaks to the color of the sound, but for any significant surgery you should use an external EQ module. When set to its central value of 64, the EQ filter is effectively disabled.

### <a href="#pan" name="pan">Pan L-R</a>

Pans the output of the entire instrument to the left or right.

## Tempo Delay

### <a href="#delaytoggle" name="delaytoggle">Tempo Delay on/off</a>

Toggles delay on or off.

### <a href="#delaytype" name="delaytype">Delay Type</a>

Sets the type of delay. Can be:

* `ST` - Stereo - two mono delays, one for the left channel and one for the right. The left dry signal is fed into the left delay, the right signal in the right delay. If the input signal is mono then the output delay effect will appear as mono too.
* `X` - Cross-Feedback - like a stereo delay, but delay feedback is looped into the *opposite* delay channel to the channel that created it. This creates a bouncing effect.
* `PP` - Ping-Pong - two mono delays, but the dry signal is initially fed into only one of the delays. The feedback is looped into the *opposite* delay channel. This creates a more pronounced ping-pong effect than cross-feedback, since the bouncing effect is applied to the entire signal, not just the stereo elements of it.

### <a href="#delaytime" name="delaytime">Delay Time</a>

Adjusts the time delay between feedback cycles. All values are synced with the tempo, apart from shortest value, which is an unsynced 0.1ms.

### <a href="#delayspread" name="delayspread">Delay Time Spread</a>

Adds additional delay to either the left or right channels. Produces a complex, asymmetric sound.

### <a href="#delayfdbk" name="delayfdbk">Delay Feedback</a>

Adjusts the fraction of the signal the delay unit should feed back into itself on each cycle. Controls how quickly the delay effect decays.

### <a href="#delaytone" name="delaytone">Delay Tone</a>

A simple high- or low-pass filter that is applied to the delayed signal. Works in the same way as the [EQ Tone knob](#eqtone).

### <a href="#delaydw" name="delaydw">Delay dry/wet</a>

Adjusts the balance between the input signal (dry) and the delayed output signal (wet). Turning it all the way to the left (0%) cuts out the delay entirely, turning it all the way to the right (100%) cuts out the input signal entirely.

## Chorus/Flanger

For more details on how chorus and flangers work, see [this handy link](https://www.izotope.com/en/blog/music-production/understanding-chorus-flangers-and-phasers-in-audio-production.html).

### <a href="chorustoggle" name="chorustoggle">Chorus on/off</a>

Toggles chorus/flange on or off.

### <a href="#chorustype" name="chorustype">Chorus type</a>

Sets the number of copies of the input signal that the chorus unit will make.

### <a href="#chorustime" name="chorustime">Chorus delay time</a>

Adjusts the central phase delay between the copies of the input signal. Short values produce a tighter, flanger sound. Long values produce a broader, chorus sound.

### <a href="#chorusdepth" name="chorusdepth">Chorus depth</a>

Adjusts the amount that the LFO affects the phase delay between the input signal and its copies. High values give a more pronounced movement. Low values give a more subtle one. A value of zero means that the phase delay remains constant, and the sound does not change over time.

### <a href="#chorusrate" name="chorusrate">Chorus rate</a>

Adjusts the rate at which the LFO affects the phase delay between the input signal and its copies. Affects the rate of movement of the sound.

### <a href="#chorusfdbk" name="chorusfdbk">Chorus feedback</a>
Adjusts the amount that the chorus output should be fed back into the unit to produce a range of resonances and odd effects. The effects can be somewhat unpredictable.

### <a href="#choruslevel" name="choruslevel">Chorus level</a>

Adjusts the volume of the copies of the input signal. A value of 0 effectively disables the chorus unit.

## Voice

### <a href="#voicemode" name="voicemode">Voice play mode</a>

Sets how the synthesizer responds to multiple notes being played at the same time. Can be:

* `poly` - polyphonic - the synthesizer will output multiple notes simultaneously
* `mono` - monophonic - the synthesizer will only ever output a single note at a time. If a second key is pressed whilst a first key is still held down, the synthesizer will stop playing the first note and retrigger with the second note. The volume and filter envelopes will restart from the beginning. If the second key is released while the first is still held down, it will similarly retrigger the first note.
* `legator` - legato - same as `mono` mode, but envelopes are not retriggered until all notes have been released.

### <a href="#voicepoly" name="voicepoly">Voice polyphony</a>

Sets how many notes the synthesizer will output simultaneously in `poly` mode. If you hold down more keys than the polyphony number, the notes of the first keys that you pressed will be stopped.

Has no effect in `mono` or `legato` modes.

### <a href="#portamount" name="portamount">Voice portamento</a>

Adjusts how long it takes to slide between notes. Set to 0 if you don't want any slide.

### <a href="#portauto" name="portauto">Portamento auto mode on/off</a>

Toggles portamento auto mode. When enabled, the synthesizer only slides between notes if you play legato and press a second note before releasing the first. According to [Zoran Nikolic][zn]:

> "The effect of Auto Portamento is pretty obvious when you have selected Mono or Legato Play Mode. If, on the other hand, Poly mode is selected, the Portamento effect will be slightly unpredictable if Auto is on. Therefore, turning off Auto in Poly mode is recommended."

### <a href="#unisontoggle" name="unisontoggle">Unison on/off</a>

Toggles unison mode on or off.

### <a href="#unisonvoice" name="unisonvoice">Unison voice count</a>

Sets the number of unison voices.

### <a href="#unisondetune" name="unisondetune">Unison detune</a>

Adjusts the amount that the unison-ed voices are detuned by. Creates a broader, fatter sound.

### <a href="#unisonphase" name="unisonphase">Unison phase</a>

Adjusts the phase shift between the input signal and the unison-ed voices. Has no effect unless you fix the relative phase of the two oscillators using the [oscillator phase knob](#oscsphase). [Zoran Nikolic][zn] notes:

> "To hear the changes in effect, after each change in value you should press the key again."

### <a href="#unisonspread" name="unisonspread">Unison spread</a>

Adjusts the stereo spread of the unison-ed voices, panning some left and some right to produce a wide, lush, symmetrical sound. According to [Zoran Nikolic][zn]:

> "Use this to get a wide unison voices stereo image, with the emphasis on the left (negative settings) or the right (positive settings)"

However, I personally hear very little difference between very positive and very negative values.

### <a href="#unisonpitch" name="unisonpitch">Unison pitch</a>

Adjusts the pitch of the unison-ed voices, relative to the root voice.

## Arpeggiator

### <a href="#arptoggle" name="arptoggle">Arpeggiator on/off</a>

Toggles the arpeggiator on or off.

### <a href="#arppattern" name="arppattern">Arpeggiator pattern</a>

Sets the arpeggiator pattern. Can be:

* `updown` - ascends and descends the notes in the chord. Does not repeat the top or bottom notes
* `up` - ascends the notes in the chord
* `down` - descends the notes in the chord
* `random` - plays random notes in the chord. May replay a note before having played all the others.

### <a href="#arprange" name="arprange">Arpeggiator range</a>

Sets the range of the arpeggiator in octaves. The arpeggiator will repeat the chord pattern for this many octaves before starting again.

### <a href="#arpbeat" name="arpbeat">Arpeggiator beat</a>

Adjusts the speed of the arpeggiator.

### <a href="#arpgate" name="arpgate">Arpeggiator gate</a>

Adjusts the length of the notes played by the arpeggiator. If set to 0 then no sound is played.

## LFOs

### <a href="#lfotoggle" name="lfotoggle">LFO 1/2 on/off</a>

Toggles the corresponding LFO on or off.

### <a href="#lfopattern" name="lfopattern">LFO 1/2 pattern</a>

Sets the pattern of the corresponding LFO. Can be:

* Sawtooth
* Square
* Triangle
* Sine
* Stepped random
* Smoothed random

### <a href="#lfospeed" name="lfospeed">LFO 1/2 speed</a>

Adjusts the speed of the corresponding LFO. Values are synced to the tempo of your track if the tempo sync[LINK] button is enabled, and unsynced otherwise.

### <a href="#lfoamount" name="lfoamount">LFO 1/2 amount</a>

Adjusts the depth of the corresponding LFO - how much the target is modulated by the oscillator.

### <a href="#lfodest" name="lfodest">LFO 1/2 destination</a>

Sets the destination of the corresponding LFO - which parameter is modulated by the LFO. Can be:

* `osc2` - the pitch of oscillator 2
* `osc1,2` - the pitch of oscillators 1 and 2
* `filter` - [the cutoff frequency](#filterfreq) of the filter 
* `amp` - the [amplitude](#ampgain) of the instrument
* `p/w` - the [pulse width](#oscspw) of oscillators 1 and 2
* `FM` - the [FM](#osc1fm) of oscillator 1
* `pan` - the pan direction of the instrument

### <a href="#lfotemposync" name="lfotemposync">LFO 1/2 tempo sync</a>

Sets whether the speed of the corresponding LFO is sync-ed to the tempo of the track or not.

### <a href="#lfokeysync" name="lfokeysync">LFO 1/2 key sync</a>

Sets whether the cycle of the corresponding LFO is reset every time a key is pressed, or whether it maintains a constant, background oscillation.

## MIDI controls

### <a href="pbrange" name="pbrange">Pitch bend range</a>

Sets the range of the pitch bend wheel.

### <a href="midisource" name="midisource">MIDI control 1/2 source</a>

Sets the source MIDI controller. Can be one of many options that I won't list here - click the Synth1 window to see the full list.

### <a href="miditarget" name="miditarget">MIDI control target parameter</a>

Sets the parameter modulated by the MIDI controller. Can be one of many options that I won't list here - click the Synth1 window to see the full list.

### <a href="#midisens" name="midisens">MIDI control 1/2 sensitivity</a>

Sets how much, and in which direction, the target parameter is affected by the MIDI controller. 

[zn]: https://sound.eti.pg.gda.pl/student/eim/doc/Synth1.pdf
