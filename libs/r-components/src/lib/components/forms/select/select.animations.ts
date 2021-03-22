 import {
  animate,
  animateChild,
  AnimationTriggerMetadata,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const rSelectAnimations: {
  readonly transformPanelWrap: AnimationTriggerMetadata;
  readonly transformPanel: AnimationTriggerMetadata;
} = {
  transformPanelWrap: trigger('transformPanelWrap', [
      transition('* => void', query('@transformPanel', [animateChild()],
          {optional: true}))
  ]),

  transformPanel: trigger('transformPanel', [
    state('void', style({
      opacity: 0,
      minWidth: 'calc(100%)',
      transform: 'scaleY(0.75)'
    })),
    state('showing', style({
      opacity: 1,
      minWidth: 'calc(100%)',
      transform: 'scaleY(1)'
    })),
    state('showing-multiple', style({
      opacity: 1,
      minWidth: 'calc(100%)',
      transform: 'scaleY(1)'
    })),
    transition('void => *', animate('120ms cubic-bezier(0, 0, 0.2, 1)')),
    transition('* => void', animate('100ms 25ms linear', style({opacity: 0})))
  ])
};
