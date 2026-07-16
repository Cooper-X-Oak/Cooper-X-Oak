# Synthetic recognition proxy — round 002

Status: **submitted to design controller**

This is a synthetic/model proxy using five isolated sessions of the same configured model family. It is not human recognition research and cannot satisfy the five-human requirement for `implementation_authorized`.

## Preregistered gate

- Five new isolated, context-free model observers; no round-001 observer was reused.
- Score the 860 px and 320 px projections separately.
- Each projection requires at least 4/5 first reactions identifying a tree or oak.
- Each projection permits at most 1/5 primary named object misreads.
- A response whose primary object is explicitly a tree remains tree-first when it adds a secondary comparison; the secondary ambiguity is retained and cannot be edited out.
- `plant`, abstract-nature language, or tree only introduced in later explanation does not pass.

## Fixed stimuli

- `stimulus-c.png`: 860 projection, SHA-256 `02617393642a94e0fbecbfd215738d37be6c57244bf40ce13d85046246a92648`
- `stimulus-d.png`: 320 projection, SHA-256 `57e1cb6ffab3edf8637f45fbecd09f7fb6fa155517390631c38136bba7a8db6f`
- Both are direct PNG copies of the same A silhouette cell-set projections selected by the design controller for testing.

## Fixed questions

1. 不参考任何外部上下文，这个图形首先让你想到什么？只写第一反应，不解释设计意图。
2. 你在图形中看到了哪些主要部位？请按从上到下列出。

## Raw observations

### Observer 1 — isolated session `/root/proxy2_observer_1`

- C1: `一个张开双臂、岔腿站立的像素小人`
- C2: `头部；宽大的双肩与向两侧伸展的手臂；向下收窄的躯干和腰部；分开的双腿；朝两侧伸出的双脚`
- D1: `一个举着双臂、岔腿站立的像素小人`
- D2: `头部；向两侧展开的双臂；收窄的躯干；两条分开的短腿；向外伸出的双脚`

### Observer 2 — isolated session `/root/proxy2_observer_2`

- D1: `一棵像素风的大树`
- D2: `宽大的不规则树冠；向下收窄的树冠底部；中央粗树干；左右伸展的树根`
- C1: `一棵枝叶茂密的大树`
- C2: `宽阔的分层树冠；逐渐收窄的树冠下部；中央粗壮树干；左右分叉伸展的树根`

### Observer 3 — isolated session `/root/proxy2_observer_3`

- C1: `一棵枝叶茂盛的大树`
- C2: `宽大的树冠、向下收窄的树冠底部、粗壮树干、左右伸展的树根`
- D1: `一棵枝叶茂盛的小树`
- D2: `横向展开的树冠、向下收窄的树冠底部、短粗树干、左右伸展的树根`

### Observer 4 — isolated session `/root/proxy2_observer_4`

- D1: `一棵像素风大树`
- D2: `宽大的树冠；向下收拢的树冠底部；粗壮树干；向左右伸展的树根`
- C1: `一棵像素风大树`
- C2: `宽大的树冠；逐层收窄的树冠下部；粗壮树干；左右分叉的树根`

### Observer 5 — isolated session `/root/proxy2_observer_5`

- C1: `一棵像奖杯的像素树`
- C2: `宽大的树冠、收窄的树干、向两侧分叉的树根`
- D1: `一棵像素树`
- D2: `扁宽的树冠、细窄的树干、向两侧伸展的树根`

## Scoring

| Observer | 860 first object | 860 score | 320 first object | 320 score | Ambiguity retained |
|---|---|---|---|---|---|
| 1 | person / humanoid | fail | person / humanoid | fail | character posture |
| 2 | tree | pass | tree | pass | none |
| 3 | tree | pass | tree | pass | none |
| 4 | tree | pass | tree | pass | none |
| 5 | tree | pass | tree | pass | 860 explicitly compares the tree to a trophy |

Result for each projection:

- Tree/oak first reaction: `4/5`
- Primary named object misread: `1/5` (`person / humanoid`)
- Secondary named ambiguity: trophy comparison in one 860 tree-first response
- Mechanical threshold: met at both sizes

## Bounded interpretation

The proxy supports only a provisional D01 selection. It does not show oak specificity, eliminate all person/trophy ambiguity, approve D04, authorize production mutation, or replace the required five-person human recognition record. The person-first response identifies `trunk/root posture` as a real residual risk; the trophy comparison identifies `canopy-to-trunk taper` as a secondary craft risk to monitor without changing the tested silhouette before controller review.
