const fs = require("fs");

// Config, change these before running
const path = "../../.config/karabiner/karabiner.json"; // Path to your Karabiner.json usually ~/.config/karabiner/karabiner.json

const profile = "Artsey"; // Profile name in Karabiner, will be overwritten if it exists

const layerHold = 250; // How long required to trigger a hold layer

// Keys to use on your keyboard. 1 is A, 2 is R, 3 is T, 4 is S, 5 is E, 6 is Y, 7 is I, 8 is O
const bindings = {
  1: "y",
  2: "u",
  3: "i",
  4: "o",
  5: "h",
  6: "j",
  7: "k",
  8: "l",
};

// Actions to take when enabling/disabling artsey. Here I'm switching the OS to
// QWERTY so that mappings are correct.
const onEnable = [
  {
    "select_input_source": {
      "language": "^en$"
    }
  }
];

const onDisable = [
  {
    "select_input_source": {
      "language": "^fr$"
    }
  }
];

const globals = {
  return_or_enter: [1, 5],
  spacebar: [5, 6, 7, 8],
  delete_or_backspace: [2, 5],
  escape: [1, 2, 8],
  tab: [1, 2, 3, 8],
  quote: [1, 6, 7],
  period: [1, 7],
  comma: [1, 6],
  slash: [1, 8],
  caps_lock: [1, 6, 7, 8],
  "!": [3, 7],
};

const alphas = {
  a: [1],
  b: [5, 8],
  c: [5, 6],
  d: [1, 2, 3],
  e: [5],
  f: [1, 2],
  g: [2, 3],
  h: [5, 7],
  i: [7],
  j: [3, 4],
  k: [6, 8],
  l: [5, 6, 7],
  m: [6, 7, 8],
  n: [7, 8],
  o: [8],
  p: [5, 7, 8],
  q: [1, 3, 4],
  r: [2],
  s: [4],
  t: [3],
  u: [6, 7],
  v: [2, 4],
  w: [1, 4],
  x: [2, 3, 4],
  y: [6],
  z: [1, 2, 3, 4],
};

const oneShots = {
  left_shift: [2, 3, 4, 5],
  left_gui: [4, 6],
  left_control: [4, 5],
  left_alt: [4, 7],
};

const layers = {
  numbers: {
    trigger: 4,
    map: {
      1: [1],
      2: [2],
      3: [3],
      4: [5],
      5: [6],
      6: [7],
      7: [1, 2],
      8: [2, 3],
      9: [5, 6],
      0: [6, 7],
      vk_none: [8],
    },
  },
  symbols: {
    trigger: 1,
    map: {
      "(": [2],
      ")": [3],
      "{": [4],
      "[": [6],
      "]": [7],
      "}": [8],
      vk_none: [5],
    },
  },
  symbols2: {
    trigger: 5,
    map: {
      "`": [4],
      ";": [3],
      "\\": [2],
      "!": [1],
      "=": [8],
      "-": [7],
      "?": [6],
    },
  },
  custom: {
    trigger: 8,
    map: {
      mute: [1],
      volume_increment: [3],
      volume_decrement: [7],
      vk_none: [4],
    },
  },
};

const lockLayers = {
  nav: {
    trigger: [2, 5, 7],
    map: {
      up_arrow: [2],
      down_arrow: [6],
      left_arrow: [5],
      right_arrow: [7],
      home: [1],
      end: [3],
      page_down: [8],
      page_up: [4],
    },
  },
};

const existing = JSON.parse(fs.readFileSync(path));

const output = {};
output.complex_modifications = {
  parameters: {
    "basic.simultaneous_threshold_milliseconds": 200,
    "basic.to_delayed_action_delay_milliseconds": 500,
    "basic.to_if_alone_timeout_milliseconds": 1000,
    "basic.to_if_held_down_threshold_milliseconds": 500,
    "mouse_motion_to_scroll.speed": 100,
  },
  rules: [],
};
output.devices = [];
output.fn_function_keys = [];
output.name = profile;
output.selected = true;
output.parameters = {
  delay_milliseconds_before_open_device: 1000,
};
output.simple_modifications = [];
output.virtual_hid_keyboard = {
  country_code: 0,
  indicate_sticky_modifier_keys_state: true,
  mouse_key_xy_scale: 100,
};

existing.profiles.forEach(profile => { profile.selected = false; });

const oldArtseyLayoutIx = existing.profiles.findIndex(
  (p) => p.name === profile
);

if (oldArtseyLayoutIx > -1) {
  delete existing.profiles[oldArtseyLayoutIx];
}

function checkVariableSet(variable) {
  return {
    type: "variable_if",
    name: variable,
    value: 1,
  };
}

function checkVariableUnset(variable) {
  return {
    type: "variable_if",
    name: variable,
    value: 0,
  };
}

function setFlag(variable) {
  return {
    set_variable: {
      name: variable,
      value: 1,
    }
  };
}

function clearFlag(variable) {
  return {
    set_variable: {
      name: variable,
      value: 0,
    }
  };
}

const checkEnabled = checkVariableUnset("disable_artsey");
const checkDisabled = checkVariableSet("disable_artsey");

// Shift+Capslock to toggle
output.complex_modifications.rules.push({
  description: "shift+caps_lock to enable artsey.io",
  manipulators: [
    {
      conditions: [
        checkEnabled,
      ],
      from: {
        key_code: "caps_lock",
        modifiers: {
          mandatory: [ "shift" ]
        },
      },
      to: [
        setFlag("disable_artsey"),
        ...onDisable
      ],
      type: "basic",
    },
  ],
});

output.complex_modifications.rules.push({
  description: "shift+caps_lock to disable artsey.io",
  manipulators: [
    {
      conditions: [
        checkDisabled,
      ],
      from: {
        key_code: "caps_lock",
        modifiers: {
          mandatory: [ "shift" ]
        },
      },
      to: [
        clearFlag("disable_artsey"),
        ...onEnable
      ],
      type: "basic",
    },
  ],
});

// Space for cheatsheet
output.complex_modifications.rules.push({
  description: "spacebar to artsey.io cheatsheet",
  manipulators: [
    {
      conditions: [
        checkEnabled,
        {
          type: 'frontmost_application_unless',
          bundle_identifiers: [ 'com.apple.quicklook.qlmanage' ]
        },
      ],
      from: {
        key_code: "spacebar",
      },
      to: [
        {
          shell_command: `qlmanage -p ${__dirname}/cheatsheet_right.png`
        }
      ],
      type: "basic",
    },
  ],
});

// Lock Layer triggers
Object.entries(lockLayers).forEach(([layer, { trigger }]) => {
  mapKey(trigger, null, { isLockLayer: true, layer });
});

Object.entries(oneShots).forEach(([to, from]) => {
  mapKey(from, to, { isOneShot: true });
});

// Add globals
Object.entries(globals)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([to, from]) => {
    mapKey(from, to, {});
  });

// layers
Object.entries(layers).forEach(([layer, { trigger, map }]) => {
  Object.entries(map)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([to, from]) => {
      mapKey(from, to, { layer });
    });
});

// lock layers
Object.entries(lockLayers).forEach(([layer, { trigger, map }]) => {
  Object.entries(map)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([to, from]) => {
      mapKey(from, to, { layer });
    });
});

// Add alphas
Object.entries(alphas)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([to, from]) => {
    mapKey(from, to, { enableLayerHold: true });
  });

// Void covered keys
[
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
].forEach((from) => {
  const boundKeys = Object.values(bindings);
  if (!boundKeys.includes(from)) {
    output.complex_modifications.rules.push({
      description: `${from} to vk_none`,
      manipulators: [
        {
          conditions: [ checkEnabled ],
          from: { key_code: from },
          to: { key_code: "vk_none" },
          type: "basic",
        },
      ],
    });
  }
});

existing.profiles.push(output);

existing.profiles = existing.profiles.filter((p) => !!p);

fs.writeFileSync(path, JSON.stringify(existing, null, 2));

function setOneShot(mod) {
  return [
    setFlag(`one_shot_${mod}`),
    {
      set_notification_message: {
        id: `io.artsey.one_shot_${mod}`,
        text: mod.replace(/.*_/, ''),
      }
    }
  ];
}

function clearOneShot(mod) {
  return [
    clearFlag(`one_shot_${mod}`),
    {
      set_notification_message: {
        id: `io.artsey.one_shot_${mod}`,
        text: '',
      }
    }
  ];
}

function checkOneShot(mod) {
  return checkVariableSet(`one_shot_${mod}`);
}

function doLockLayer(layer, fromKeys) {
  output.complex_modifications.rules.push({
    description: `${fromKeys.join()} to lock ${layer}`,
    manipulators: [
      {
        conditions: [
          checkEnabled,
          checkVariableUnset(`layer_${layer}`),
        ],
        from: makeFrom(fromKeys),
        to: [
          setFlag(`layer_${layer}`),
          {
            set_notification_message: {
              id: `io.artsey.lock_${layer}`,
              text: layer
            }
          },
        ],
        type: "basic",
      },
    ],
  });
  output.complex_modifications.rules.push({
    description: `${fromKeys.join()} to unlock ${layer}`,
    manipulators: [
      {
        conditions: [
          checkEnabled,
          checkVariableSet(`layer_${layer}`),
        ],
        from: makeFrom(fromKeys),
        to: [
          clearFlag(`layer_${layer}`),
          {
            set_notification_message: {
              id: `io.artsey.lock_${layer}`,
              text: ''
            }
          },
        ],
        type: "basic",
      },
    ],
  });
}

function doOneShot(mod, fromKeys) {
  [true, false].forEach(cancel => {
    output.complex_modifications.rules.push({
      description: `${fromKeys.join()} to [one shot] ${mod}${cancel ? ' cancel':''}`,
      manipulators: [
        {
          conditions: [
            checkEnabled,
            ...(cancel ? [ checkOneShot(mod) ] : [ ])
          ],
          from: makeFrom(fromKeys),
          to: cancel ? clearOneShot(mod) : setOneShot(mod),
          type: "basic",
        },
      ],
    });
  });
}

// General rule builder
function mapKey(
  from,
  to,
  {
    enableLayerHold,
    layer,
    isOneShot,
    isLockLayer,
  } = {}
) {
  const fromKeys = from.map((f) => bindings[f]);

  if (isLockLayer) {
    return doLockLayer(layer, fromKeys);
  }

  if (isOneShot) {
    return doOneShot(to, fromKeys);
  }

  const conditions = [
    checkEnabled,
    ...( layer ? [ checkVariableSet(`layer_${layer}`) ] : [ ] )
  ];

  const matchingLayer = Object.keys(layers).find(
    (layername) => from.length === 1 && layers[layername].trigger === from[0]
  );

  const combinations = buildCombinations(Object.keys(oneShots), false);

  combinations.forEach((mods) => {
    const manipulator = {
      conditions: [
        ...conditions,
        ...mods.map(checkOneShot),
      ],
      from: makeFrom(fromKeys),
      to: [
        { ...mapTo(to), modifiers: mods },

        ...mods.flatMap(clearOneShot),
      ],
      type: "basic",
    };

    if (enableLayerHold && matchingLayer) {
      Object.assign(manipulator, {
        to_if_alone: manipulator.to,
        to: setFlag(`layer_${matchingLayer}`),
        to_after_key_up: clearFlag(`layer_${matchingLayer}`),
        parameters: {
          "basic.to_if_alone_timeout_milliseconds": layerHold,
          "basic.to_if_held_down_threshold_milliseconds": layerHold,
        },
      });
    }

    output.complex_modifications.rules.push({
      description: `${mods.length > 0 ? `[${mods.join()}] `: ''}${fromKeys.join()} to ${to}`,
      manipulators: [ manipulator ],
    });
  });
}

function makeFrom(fromKeys) {
  return fromKeys.length > 1 ? {
    simultaneous: fromKeys.map((f) => ({ key_code: f })),
    simultaneous_options: {
      detect_key_down_uninterruptedly: false,
      key_down_order: "insensitive",
      key_up_order: "insensitive",
      key_up_when: "any",
    },
  } : { key_code: fromKeys[0] };
}

// Used to map shifted symbols mainly
function mapTo(key) {
  const mapping = {
    "{": {
      key_code: "open_bracket",
      modifiers: ["left_shift"],
    },
    "}": {
      key_code: "close_bracket",
      modifiers: ["left_shift"],
    },
    "[": {
      key_code: "open_bracket",
    },
    "]": {
      key_code: "close_bracket",
    },
    "(": {
      key_code: "9",
      modifiers: ["left_shift"],
    },
    ")": {
      key_code: "0",
      modifiers: ["left_shift"],
    },
    "`": {
      key_code: "grave_accent_and_tilde",
    },
    ";": {
      key_code: "semicolon",
    },
    "\\": {
      key_code: "backslash",
    },
    "!": {
      key_code: "1",
      modifiers: ["left_shift"],
    },
    "=": {
      key_code: "equal_sign",
    },
    "-": {
      key_code: "hyphen",
    },
    "?": {
      key_code: "slash",
      modifiers: ["left_shift"],
    },
  }
  return mapping[key] ?? {
    key_code: key,
  };
}

function buildCombinations(inputs, ignoreEmpty) {
  let result = [];
  for (let i = 0; i < 2 ** inputs.length; i++) {
    const combo = i.toString(2).padStart(inputs.length, "0").split("");
    result.push(inputs.filter((k, ix) => combo[ix] === "1"));
  }

  const filtered = ignoreEmpty ? result.filter((k) => k.length > 0) : result;

  return filtered.sort((a, b) => b.length - a.length);
}
