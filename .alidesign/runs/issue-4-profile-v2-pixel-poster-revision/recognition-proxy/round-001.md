# Synthetic recognition proxy — round 001

Status: **failed early**

This is a synthetic/model proxy, not human recognition research. It cannot satisfy the five-human requirement for `implementation_authorized`.

## Preregistered gate

- Five isolated, context-free model observers.
- Evaluate the 860 px and 320 px projections separately.
- Each projection requires at least 4/5 first reactions identifying a tree or oak.
- Each projection permits at most 1/5 named object misreads.
- Stop early when the gate becomes mathematically impossible to pass.

## Fixed stimuli

- `stimulus-a.png`: 860 × 573, SHA-256 `4aa5563d8ef36b130f7254d48bbaf5a03eedc062d5abaa81a5ba9a7e3f5b60bf`
- `stimulus-b.png`: 320 × 213, SHA-256 `ac4765fc22dda921f251750b743ab9dda66ec6e335056098ade87da9bedf28c0`
- Both are nearest-neighbor projections of one monochrome source, SHA-256 `279598209cddc26719dd1a9f50d843076633596f8567cc2497035c3e63147b7f`.

## Fixed questions

1. 不参考任何外部上下文，这个图形首先让你想到什么？只写第一反应，不解释设计意图。
2. 你在图形中看到了哪些主要部位？请按从上到下列出。

## Raw observations

### Observer 1 — isolated Codex sub-agent session `/root/observer_1`

- A1: `像素风奖杯`
- A2: `宽大的杯口与杯身、中央亮色开口、收窄的杯脚、横向底座`
- B1: `像素风奖杯`
- B2: `宽大的杯口与杯身、中央亮色开口、收窄的杯脚、横向底座`

### Observer 2 — isolated Codex sub-agent session `/root/observer_2`

- B1: `像素风奖杯`
- B2: `宽大的杯口与杯身、中央白色 T 形区域、收窄的杯脚、横向底座`
- A1: `像素风奖杯`
- A2: `宽大的杯口与杯身、中央白色 T 形区域、收窄的杯脚、横向底座`

## Early-stop calculation

After 2/5 observers, both projections have 0 tree/oak first reactions and 2 named `奖杯` misreads. The allowed named-misread maximum is 1/5. Even if all three remaining observers answered tree/oak, each projection would finish at 3/5 tree/oak and 2/5 named misreads, failing both thresholds.

Observer 3 was therefore interrupted before returning an answer; observers 4 and 5 were not started. Missing observations are not imputed.

## Directed finding

The canopy-to-trunk transition and wide horizontal base currently form the familiar `cup body → narrow stem → pedestal` sequence. The centered negative notch reinforces a trophy/cup reading. This silhouette cannot be promoted to canonical visual design and must be revised before another recognition round.
