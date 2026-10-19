import { SummaryPage } from '../../types';

export const PHYSICS_LANG_PAGES_24: SummaryPage[] = [
  {
    pageNumber: 1,
    title: 'Electric Current, Ohm\'s Law & Resistance Concepts',
    content: [
      'Electric Current: The flow of electric charges through a conductor. Conventional current flows from positive to negative terminal externally, whereas electronic (actual) current flows from negative to positive.',
      'Electric Current Intensity (I): Quantity of electric charge (Q) passing through a conductor cross-section per second. Unit: Ampere (A) = Coulomb/second. Formula: I = Q / t = (n × e) / t, where n is number of free electrons and e = 1.6 × 10^-19 C.',
      'Potential Difference (V): Work done (W) to transfer 1 Coulomb between two points. Unit: Volt (V) = Joule/Coulomb. V = W / Q.',
      'Ohm\'s Law: At constant temperature, current intensity is directly proportional to potential difference: V = I × R. Electric Resistance (R) is the opposition to electron flow due to collisions with vibrating lattice ions. Unit: Ohm (Ω).'
    ],
    keyFormulas: [
      'I = Q / t = (n × e) / t',
      'V = W / Q',
      'R = V / I (Ohm\'s Law)'
    ],
    examTip: 'If given electron flow rate of 10^19 electrons/sec, multiply directly by e (1.6×10^-19) to get I = 1.6 A instantly.'
  },
  {
    pageNumber: 2,
    title: 'Resistivity, Conductivity & Wire Stretching Rules',
    content: [
      'Factors affecting conductor resistance: Directly proportional to length (L), inversely proportional to cross-sectional area (A), and directly proportional to resistivity (ρ_e): R = (ρ_e × L) / A = (ρ_e × L) / (π r²).',
      'Electric Resistivity (ρ_e): Characteristic physical property of material depending only on material type and temperature. Unit: Ohm·meter (Ω·m). Higher temperature increases ion vibration amplitude, increasing resistivity.',
      'Electric Conductivity (σ): Reciprocal of resistivity: σ = 1 / ρ_e. Unit: (Ω·m)⁻¹ or Siemens/meter.',
      'Wire Stretching & Reshaping (Volume Constant): Volume Vol = A × L and mass remain constant. If a wire is stretched so that length doubles (L2 = 2 L1), area halves (A2 = A1/2), hence resistance quadruples: R2 / R1 = (L2/L1)² = (A1/A2)² = (r1/r2)⁴.'
    ],
    keyFormulas: [
      'R = (ρ_e × L) / A',
      'σ = 1 / ρ_e',
      'Stretching wire: R2 / R1 = (L2/L1)² = (r1/r2)⁴'
    ],
    examTip: 'If a wire is stretched such that its length increases by 20%, L2 = 1.2 L1, so R2 = (1.2)² R1 = 1.44 R1 (a 44% increase in resistance, not 20%!).'
  },
  {
    pageNumber: 3,
    title: 'Series & Parallel Resistors & Branch Current Division',
    content: [
      'Series Connection: Current is constant through all resistors (I_total = I1 = I2), voltage divides: V_total = V1 + V2. Equivalent resistance: R_eq = R1 + R2 + ... + Rn. Equal resistors: R_eq = n × R.',
      'Parallel Connection: Voltage is identical across all parallel branches (V_total = V1 = V2), current divides: I_total = I1 + I2. Reciprocal rule: 1/R_eq = 1/R1 + 1/R2. Two resistors: R_eq = (R1 × R2) / (R1 + R2). Equal resistors: R_eq = R / n.',
      'Branch Current Formula: I_branch = I_total × (R_parallel / R_branch).',
      'Resistance Cancellation: A resistor carries no current if connected in parallel with an ideal short-circuit wire, or if positioned in a balanced Wheatstone bridge (R1/R2 = R3/R4).'
    ],
    keyFormulas: [
      'Series: R_eq = R1 + R2 + ...',
      'Parallel: 1/R_eq = 1/R1 + 1/R2 + ...',
      'Two parallel: R_eq = (R1 R2) / (R1 + R2)',
      'Branch current: I1 = I_tot × (R_par / R1)'
    ],
    examTip: 'Shortcut for branch current: Branch current = (Total current entering parallel group × Equivalent resistance of parallel group) / Branch resistance.'
  },
  {
    pageNumber: 4,
    title: 'Ohm\'s Law for Closed Circuit & Voltmeter Readings',
    content: [
      'Electromotive Force (EMF, V_B): Total work done to transfer 1 Coulomb throughout the entire circuit (internally and externally). Internal resistance (r) is the resistance of electrolyte inside the battery.',
      'Closed Circuit Formula: I = V_B / (R_eq + r).',
      'Terminal Voltage (Voltmeter across battery V): 1. Discharging battery (supplying current): V = V_B - (I × r). Terminal voltage is less than EMF due to internal voltage drop (I r). V = V_B when switch is open (I = 0) or internal resistance is negligible (r = 0). 2. Charging battery (connected to larger opposing battery): V = V_B + (I × r) (Terminal voltage exceeds EMF!).',
      'Electric Energy & Power: Power P_w = V × I = I² × R = V² / R. Energy W = P_w × t.'
    ],
    keyFormulas: [
      'I = V_B / (R_eq + r)',
      'Discharging: V = V_B - I r',
      'Charging: V = V_B + I r',
      'P_w = V I = I² R = V² / R'
    ],
    examTip: 'As external resistance R increases, total current I decreases, so the internal drop (I r) decreases, causing the voltmeter across the battery V = V_B - I r to INCREASE.'
  },
  {
    pageNumber: 5,
    title: 'Kirchhoff\'s First & Second Laws for Complex Circuits',
    content: [
      'Kirchhoff\'s First Law (Current Law / Junction Rule): The algebraic sum of currents entering any node equals the sum of currents leaving it: Σ I_in = Σ I_out (or Σ I = 0). Physical basis: Conservation of Electric Charge.',
      'Kirchhoff\'s Second Law (Voltage Law / Loop Rule): The algebraic sum of EMFs around any closed loop equals the algebraic sum of potential differences (IR drops): Σ V_B = Σ (I × R) (or Σ V = 0). Physical basis: Conservation of Energy.',
      'Sign Rules: Traveling along loop in assumed direction: crossing battery from - to + counts as +V_B; crossing resistor in direction of current counts as +IR. If traveling against current, counts as -IR.',
      'Potential of a Point: V_point = V_reference - Σ (V_drops along the path to point). If circuit is grounded, V_ground = 0 V.'
    ],
    keyFormulas: [
      'KCL: Σ I_in = Σ I_out (Conservation of Charge)',
      'KVL: Σ V_B = Σ (I R) (Conservation of Energy)',
      'Ground potential: V_earth = 0 V'
    ],
    examTip: 'To set up Kirchhoff equations for 3 loop currents: label nodes, write 1 KCL node equation, write 2 KVL loop equations, then solve on calculator using Mode 5 (Equation).'
  },
  {
    pageNumber: 6,
    title: 'Magnetic Flux & Field of Straight Wire, Circular Coil & Solenoid',
    content: [
      'Magnetic Flux (Φ_m): Total number of magnetic field lines passing perpendicularly through an area: Φ_m = B × A × sin(θ) (or cos θ with normal). Unit: Weber (Wb) = Tesla·m².',
      'Long Straight Wire: Field lines are concentric circles centered on the wire. Direction: Right-Hand Grip Rule. Magnetic flux density: B = (μ × I) / (2 π d). (Ampere\'s Circuital Law).',
      'Circular Coil: Field lines at the center are straight, parallel and perpendicular to the coil plane. Direction: Right-Hand Screw Rule. Density: B = (μ × N × I) / (2 r). If re-coiled with new turns: B2 / B1 = (N2 / N1)² = (r1 / r2)².',
      'Solenoid: Uniform magnetic field inside along axis. Density: B = (μ × N × I) / L = μ × n × I, where n = N / L is turns per unit length. When compressed into a circular coil: B_solenoid / B_coil = 2 r / L.'
    ],
    keyFormulas: [
      'Straight wire: B = (μ I) / (2 π d)',
      'Circular coil: B = (μ N I) / (2 r)',
      'Solenoid: B = (μ N I) / L = μ n I',
      'Coil re-wound: B2/B1 = (N2/N1)²'
    ],
    examTip: 'If a circular coil is pulled axially to become a solenoid: B_sol / B_coil = 2r / L. If a solenoid has turns touching closely: L = N × 2 r_wire.'
  },
  {
    pageNumber: 7,
    title: 'Magnetic Force on a Current-Carrying Wire & Mutual Forces',
    content: [
      'Force on Current-Carrying Wire: A straight wire of length L carrying current I placed in magnetic field B experiences magnetic Lorentz force: F = B × I × L × sin(θ), where θ is angle between wire and field B.',
      'Direction of Force: Fleming\'s Left-Hand Rule (Thumb = Force F, Index = Field B, Middle fingers = Current I). Maximum force when θ = 90° (perpendicular), zero force when θ = 0° or 180° (parallel).',
      'Mutual Force between Two Parallel Wires: F_mutual = (μ × I1 × I2 × L) / (2 π d). - Currents in SAME direction: Attraction force between wires. Neutral point lies between them, closer to weaker current. - Currents in OPPOSITE directions: Repulsion force between wires. Neutral point lies outside, adjacent to weaker current.',
      'Neutral Point Rule: Net magnetic field is zero: B1 = B2 => I1 / d1 = I2 / d2.'
    ],
    keyFormulas: [
      'F = B I L sin(θ)',
      'Mutual Force: F = (μ I1 I2 L) / (2 π d)',
      'Neutral point: I1 / d1 = I2 / d2'
    ],
    examTip: 'Mutual force between two wires is ALWAYS action-reaction (Newton\'s 3rd Law): Force on wire 1 by wire 2 equals force on wire 2 by wire 1, even if I1 = 10 A and I2 = 1 A!'
  },
  {
    pageNumber: 8,
    title: 'Magnetic Torque on a Coil & Magnetic Dipole Moment',
    content: [
      'Magnetic Torque (τ): Turning effect produced by couple of magnetic forces acting on opposite sides of a coil carrying current in magnetic field: τ = B × I × A × N × sin(θ_normal) = B × I × A × N × cos(θ_plane).',
      'Angle Definition (Crucial Trap): In torque formula τ = B I A N sin(θ), angle θ is between the NORMAL to the coil plane and the magnetic field lines (or angle between coil plane and field direction is α, where θ = 90 - α). - Coil plane PARALLEL to field: Torque is MAXIMUM (θ = 90°). - Coil plane PERPENDICULAR to field: Torque is ZERO (θ = 0°).',
      'Magnetic Dipole Moment (m_d): Vector characteristic of the coil perpendicular to its plane: m_d = I × A × N = τ / (B sin θ). Unit: A·m² or N·m/T. It depends only on coil properties (I, A, N), completely independent of external magnetic field B!'
    ],
    keyFormulas: [
      'τ = B I A N sin(θ_normal)',
      'm_d = I A N (Vector perpendicular to coil)',
      'τ_max = B × m_d when coil is parallel to field'
    ],
    examTip: 'When problem says: "The coil plane makes 30° with field", the angle to use in torque is θ = 90 - 30 = 60°!'
  },
  {
    pageNumber: 9,
    title: 'Measuring Instruments: Moving Coil Galvanometer & Ammeter',
    content: [
      'Moving Coil Galvanometer: Sensitive device to detect weak DC currents. Based on magnetic torque on a rectangular coil suspended in radial magnetic field between concave cylindrical magnetic poles with cylindrical soft iron core. Sensitivity S = θ / I (degree/μA). Uniform scale because radial field ensures coil is always parallel to field lines (τ = B I A N = constant torque). Restoring torque provided by two spiral springs.',
      'DC Ammeter (Shunt Resistor R_s): Measures high DC currents. Converted by connecting a very small resistance in parallel (Shunt R_s) with galvanometer coil: 1. Protects coil by bypassing most current. 2. Decreases instrument total resistance. 3. Increases measuring range. Shunt formula: R_s = (I_g × R_g) / (I - I_g). Sensitivity ratio: I_g / I = R_s / (R_s + R_g).'
    ],
    keyFormulas: [
      'Galvanometer sensitivity: S = θ / I',
      'Shunt resistor: R_s = (I_g R_g) / (I - I_g)',
      'Sensitivity ratio: I_g / I = R_s / (R_s + R_g)'
    ],
    examTip: 'If ammeter sensitivity decreases to 1/5: I_g / I = 1/5 => R_s / (R_s + R_g) = 1/5 => 5 R_s = R_s + R_g => R_s = R_g / 4.'
  },
  {
    pageNumber: 10,
    title: 'Measuring Instruments: Voltmeter & Ohmmeter',
    content: [
      'DC Voltmeter (Multiplier Resistor R_m): Measures large potential differences. Converted by connecting a very large resistance in series (Multiplier R_m) with galvanometer: 1. Increases total resistance so it draws negligible circuit current. 2. Increases voltage measurement range. Multiplier formula: R_m = (V - V_g) / I_g = (V - I_g R_g) / I_g.',
      'Ohmmeter: Measures unknown resistance R_x. Consists of galvanometer, standard resistance R_c, variable rheostat R_v, internal resistance r, and battery V_B. Circuit total internal resistance: R_device = V_B / I_g.',
      'Measuring R_x: When unknown R_x is connected: I = V_B / (R_device + R_x). Deflection ratio: I / I_g = R_device / (R_device + R_x). Ohmmeter scale is non-linear and inverse: Deflections 3/4, 1/2, 1/4 correspond to R_x = (1/3) R_device, R_device, 3 R_device respectively.'
    ],
    keyFormulas: [
      'Multiplier: R_m = (V - V_g) / I_g',
      'R_device = V_B / I_g',
      'Deflection: I / I_g = R_device / (R_device + R_x)'
    ],
    examTip: 'Golden ohmmeter rule: If pointer deflects to 1/n of full scale, the unknown resistance is R_x = (n - 1) × R_device!'
  },
  {
    pageNumber: 11,
    title: 'Electromagnetic Induction: Faraday\'s Law & Lenz\'s Rule',
    content: [
      'Phenomenon of Electromagnetic Induction: Generation of induced electromotive force (emf) and induced current in a conductor when cut by varying magnetic flux.',
      'Faraday\'s Law: Magnitude of induced emf is directly proportional to rate of change of magnetic flux and number of turns: emf = - N (ΔΦ_m / Δt).',
      'Lenz\'s Rule: Direction of induced current is such that it opposes the change in magnetic flux producing it. (Justifies negative sign in Faraday\'s formula). Physical basis: Conservation of Energy. - Magnet approaching coil: Induced pole repels (same polarity). - Magnet receding from coil: Induced pole attracts (opposite polarity).',
      'Induced EMF in a Moving Straight Wire: Wire of length L moving at velocity v perpendicular to field B: emf = - B × L × v × sin(θ). Direction of induced current given by Fleming\'s Right-Hand Rule.'
    ],
    keyFormulas: [
      'Faraday\'s Law: emf = - N (ΔΦ_m / Δt)',
      'Wire moving in field: emf = B L v sin(θ)',
      'Rate of cutting flux: ΔΦ_m = B ΔA = B L v Δt'
    ],
    examTip: 'Remember: Fleming\'s LEFT-Hand Rule is for Force/Motor, while Fleming\'s RIGHT-Hand Rule is for Induced Current/Dynamo.'
  },
  {
    pageNumber: 12,
    title: 'Mutual Induction & Self-Induction & Eddy Currents',
    content: [
      'Mutual Induction (M): Phenomenon between two neighboring coils where changing current in primary induces emf in secondary: emf_2 = - M (ΔI_1 / Δt) = - N_2 (ΔΦ_m2 / Δt). Unit of M: Henry (H) = V·s/A = Ω·s = Wb/A.',
      'Self-Induction (L): Induction within the same coil opposing any change in its own current: emf = - L (ΔI / Δt) = - N (ΔΦ_m / Δt). Self-inductance of solenoid: L = (μ × N² × A) / Length. Note that L is proportional to N².',
      'Back EMF vs Forward EMF: - Switch closing / current rising: Back EMF generated (opposes growth, delays reaching maximum). - Switch opening / current collapsing: Forward EMF generated (same direction as battery, very high voltage producing spark across switch).',
      'Eddy Currents: Closed circulating currents induced in solid metallic blocks by alternating magnetic flux. Cause massive heat dissipation. Suppressed by laminating metallic core into insulated silicon steel sheets.'
    ],
    keyFormulas: [
      'Mutual: emf_2 = - M (ΔI_1 / Δt)',
      'Self: emf = - L (ΔI / Δt)',
      'Solenoind Inductance: L = (μ N² A) / Length',
      'Henry unit: 1 H = 1 V·s/A = 1 Ω·s'
    ],
    examTip: 'Why does neon lamp flash when opening DC electromagnet circuit? Because sudden collapse of flux (tiny Δt) generates huge forward induced EMF of hundreds of volts!'
  },
  {
    pageNumber: 13,
    title: 'The Electric Generator (Dynamo) & AC Characteristics',
    content: [
      'Principle: Converts mechanical energy into electrical energy via electromagnetic induction by rotating a coil inside magnetic field.',
      'Instantaneous EMF: emf_inst = B × A × N × ω × sin(θ) = emf_max × sin(θ) = emf_max × sin(2 π f t), where ω = 2 π f is angular velocity, f is frequency (Hz), and θ is angle between normal to coil plane and magnetic field (or angle rotated from zero position / perpendicular position).',
      'Key EMF Values: 1. Maximum EMF: emf_max = B × A × N × ω = 2 π f B A N. 2. Effective EMF (RMS): emf_eff = emf_max / sqrt(2) = 0.707 × emf_max. All AC meters measure RMS values! 3. Average EMF: Over full cycle = 0. Over half cycle from zero: emf_avg = (2 / π) emf_max = 4 f N B A.',
      'Rectification of AC: Replacing slip rings with a split copper cylinder (commutator) produces unidirectional pulsating current. Using multiple coils with commutator segments produces nearly constant steady DC.'
    ],
    keyFormulas: [
      'emf_inst = emf_max sin(2 π f t)',
      'emf_max = 2 π f N A B',
      'emf_eff = emf_max / sqrt(2) = 0.707 emf_max',
      'emf_avg (half cycle) = 4 f N A B = (2/π) emf_max'
    ],
    examTip: 'To calculate electric power or heat generated in AC: ALWAYS use effective values! P_w = (I_eff)² R = (V_eff)² / R.'
  },
  {
    pageNumber: 14,
    title: 'The Electric Transformer & Electric Motor',
    content: [
      'Electric Transformer: Device that steps up or steps down alternating voltage based on mutual induction. Operates ONLY on AC (does not work on DC because constant current produces zero change in magnetic flux!).',
      'Ideal Transformer (Efficiency η = 100%): V_s / V_p = N_s / N_p = I_p / I_s. - Step-up transformer: N_s > N_p => V_s > V_p and I_s < I_p (voltage step-up means current step-down!). - Step-down transformer: N_s < N_p => V_s < V_p and I_s > I_p.',
      'Real Transformer Efficiency: η = (Power_output / Power_input) × 100 = (V_s × I_s) / (V_p × I_p) × 100. Power loss causes: Joule heating in copper windings, eddy currents in core, hysteresis loss, and flux leakage.',
      'Electric Motor (DC Motor): Converts electrical energy to mechanical rotation based on magnetic torque. Commutator reverses current in coil every half rotation to keep torque direction unidirectional.'
    ],
    keyFormulas: [
      'Ideal: V_s / V_p = N_s / N_p = I_p / I_s',
      'Efficiency: η = (V_s I_s) / (V_p I_p) × 100',
      'Transmission power loss: P_loss = I² × R_wires'
    ],
    examTip: 'High-voltage electric transmission lines use step-up transformers at power plants to minimize transmission line current I, reducing power loss P = I² R to minimum.'
  },
  {
    pageNumber: 15,
    title: 'AC Circuits: Pure Resistor, Pure Inductor & Pure Capacitor',
    content: [
      '1. Pure Ohmic Resistor (R): Current and voltage are in PHASE (phase angle φ = 0°). Resistance R is independent of AC frequency f.',
      '2. Pure Inductor (L): Voltage LEADS current by 90° (φ = +90°). Inductive Reactance: X_L = 2 π f L = ω L. X_L is directly proportional to frequency f. Inductors block high-frequency AC and pass low-frequency/DC.',
      '3. Pure Capacitor (C): Current LEADS voltage by 90° (Voltage lags current by 90°, φ = -90°). Capacitive Reactance: X_C = 1 / (2 π f C) = 1 / (ω C). X_C is inversely proportional to frequency f. Capacitors block DC completely (f = 0 => X_C = ∞) and pass high-frequency AC.'
    ],
    keyFormulas: [
      'Resistor: V and I in phase (φ = 0)',
      'Inductor: X_L = 2 π f L (V leads I by 90°)',
      'Capacitor: X_C = 1 / (2 π f C) (I leads V by 90°)',
      'Capacitor charge: Q = C × V'
    ],
    examTip: 'If AC generator frequency doubles: X_L doubles, so I = V/X_L remains CONSTANT. But for capacitor: X_C halves while V doubles, so I quadruples!'
  },
  {
    pageNumber: 16,
    title: 'RLC Series Circuits & Resonance Conditions',
    content: [
      'RLC Series Circuit: Contains R, L, and C in series. Total Impedance Z = sqrt[ R² + (X_L - X_C)² ]. Total Voltage: V = sqrt[ V_R² + (V_L - V_C)² ]. Phase angle: tan(φ) = (X_L - X_C) / R = (V_L - V_C) / V_R.',
      'Circuit Character: - X_L > X_C (φ > 0): Inductive character (voltage leads current). - X_C > X_L (φ < 0): Capacitive character (current leads voltage). - X_L = X_C (φ = 0): Resistive character (Resonance).',
      'Resonance Circuit (Tuning Circuit): Condition: X_L = X_C. 1. Impedance is at absolute MINIMUM: Z = R. 2. Current is at absolute MAXIMUM: I = V / R. 3. V_L = V_C and V_total = V_R. 4. Resonance frequency: f_0 = 1 / [ 2 π sqrt(L × C) ]. Used in radio receivers to select station frequencies.'
    ],
    keyFormulas: [
      'Impedance: Z = sqrt[ R² + (X_L - X_C)² ]',
      'Phase: tan φ = (X_L - X_C) / R',
      'Resonance: f_0 = 1 / [ 2 π sqrt(L C) ]',
      'At resonance: Z_min = R , I_max = V / R'
    ],
    examTip: 'In resonance, V_total = V_R. Even if V_L = 500 V and V_C = 500 V, they cancel each other out completely in vector sum!'
  },
  {
    pageNumber: 17,
    title: 'Modern Physics: Blackbody Radiation & Planck\'s Quantum Hypothesis',
    content: [
      'Classical Physics Failure: Classical wave theory (Rayleigh-Jeans) predicted radiation intensity increases indefinitely as wavelength decreases (Ultraviolet Catastrophe). Experimental curves (Lumier & Pringsheim) showed intensity drops to zero at very short and very long wavelengths.',
      'Planck\'s Quantum Hypothesis (1900): Electromagnetic radiation is not continuous waves, but emitted as discrete packets of energy called "Photons" or Quanta. Photon Energy: E = h × ν = (h × c) / λ, where h is Planck\'s constant (6.625 × 10^-34 J·s). Higher frequency means higher photon energy, but lower number of emitted photons for constant total power.',
      'Wien\'s Displacement Law: The wavelength corresponding to maximum radiation intensity (λ_max) is inversely proportional to absolute temperature (T in Kelvin): λ_max1 / λ_max2 = T2 / T1. (Solar surface: 6000 K, λ_max = 0.5 μm visible yellow; Earth: 300 K, λ_max = 10 μm infrared).'
    ],
    keyFormulas: [
      'Photon Energy: E = h ν = (h c) / λ',
      'Wien\'s Law: λ_max ∝ 1 / T (Kelvin)',
      'T(K) = T(°C) + 273'
    ],
    examTip: 'Remember: In Wien\'s law, temperature MUST be in Kelvin! T(K) = T(°C) + 273.'
  },
  {
    pageNumber: 18,
    title: 'The Photoelectric Effect & Einstein\'s Equation',
    content: [
      'Photoelectric Effect: Emission of electrons from metal surface when light of suitable frequency shines on it. Classical theory failed because it claimed electron emission depends on light INTENSITY and exposure time.',
      'Einstein\'s Explanation (1905): 1. Emission is instantaneous (< 10^-9 s). 2. Critical Threshold Frequency (ν_c): Minimum frequency required to liberate an electron without kinetic energy. 3. Work Function (W_e): Minimum energy required to liberate electron: W_e = h × ν_c = (h × c) / λ_c. Characteristic property of metal type only.',
      'Einstein\'s Photoelectric Equation: E_photon = W_e + KE_max => h ν = h ν_c + (1/2) m_e v² = W_e + e V_stopping. - If ν < ν_c: No electrons emitted regardless of light intensity or time! - If ν >= ν_c: Emission occurs. Increasing intensity increases number of emitted electrons (photoelectric current). Increasing frequency increases maximum kinetic energy (stopping voltage).'
    ],
    keyFormulas: [
      'W_e = h ν_c',
      'KE_max = h ν - W_e = h (ν - ν_c)',
      'KE_max = (1/2) m v² = e V_stopping'
    ],
    examTip: 'In the KE_max vs frequency graph: Slope = Planck\'s constant h (universal), X-intercept = Critical frequency ν_c, Y-intercept = - Work function W_e.'
  },
  {
    pageNumber: 19,
    title: 'Compton Effect & Dual Nature of Photons & Matter',
    content: [
      'Compton Effect: When high-energy X-ray or gamma-ray photon collides with free electron: - Scattered photon: Energy decreases, frequency decreases, wavelength INCREASES (Δλ > 0), speed remains c = 3 × 10^8 m/s. - Recoiled electron: Kinetic energy increases, momentum increases, speed increases. Physical Significance: Proves Particle Nature of radiation (Photons have mass and momentum; collision is elastic, conserving energy and linear momentum).',
      'Photon Properties: Energy E = h ν = m c². Relativistic mass m = E / c² = (h ν) / c² = h / (c λ). Linear momentum P_L = m c = E / c = h / λ.',
      'De Broglie Wavelength (Dual Nature of Matter): Moving particles of mass m and speed v exhibit wave properties: λ = h / P_L = h / (m × v). Used in Electron Microscope: High accelerating voltage V gives electrons high momentum, yielding extremely short de Broglie wavelength λ = h / sqrt(2 m e V), resolving viruses (resolving power ∝ 1/λ).'
    ],
    keyFormulas: [
      'Photon momentum: P_L = h / λ = E / c',
      'Photon mass: m = h / (c λ)',
      'De Broglie: λ = h / (m v)',
      'Electron Microscope: eV = (1/2) m v² => v = sqrt(2 e V / m)'
    ],
    examTip: 'Photon speed c is ALWAYS constant in vacuum (3×10^8 m/s). When photon loses energy in Compton effect, its speed DOES NOT decrease; only its frequency decreases and wavelength increases!'
  },
  {
    pageNumber: 20,
    title: 'Atomic Spectra & Bohr\'s Model for Hydrogen Atom',
    content: [
      'Bohr\'s Postulates: Electrons orbit nucleus in stationary discrete energy levels without radiating. Radiation emitted when electron transitions from higher level E2 to lower level E1: ΔE = E2 - E1 = h × ν = (h × c) / λ. De Broglie stationary wave condition: n × λ = 2 π r_n.',
      'Energy of Hydrogen Levels: E_n = - 13.6 / n² (in eV). 1 eV = 1.6 × 10^-19 Joules.',
      'Hydrogen Spectral Series: 1. Lyman Series: Transitions to n = 1 (Ultraviolet, highest energy/frequency). 2. Balmer Series: Transitions to n = 2 (Visible light spectrum, four colored lines). 3. Paschen Series: Transitions to n = 3 (Infrared). 4. Brackett Series: Transitions to n = 4 (Far Infrared). 5. Pfund Series: Transitions to n = 5 (Far Infrared, lowest energy).',
      'Shortest vs Longest Wavelength: - Shortest wavelength (highest energy): Transition from n = ∞ to series level. - Longest wavelength (lowest energy): Transition from adjacent upper level (n + 1) to series level.'
    ],
    keyFormulas: [
      'ΔE = E_higher - E_lower = h ν = (h c) / λ',
      'E_n = - 13.6 / n² (eV)',
      'Bohr orbit: 2 π r_n = n λ',
      'Shortest wave in Lyman: h c / λ_min = E_∞ - E_1 = 0 - (-13.6) = 13.6 eV'
    ],
    examTip: 'To convert eV to Joules: multiply by 1.6 × 10^-19. To convert Joules to eV: divide by 1.6 × 10^-19.'
  },
  {
    pageNumber: 21,
    title: 'X-Rays & Production in Coolidge Tube',
    content: [
      'X-Rays: Invisible electromagnetic radiation of very short wavelength (10^-8 to 10^-13 m) and high penetrating power. Discovered by Roentgen.',
      'Coolidge Tube Operation: Heated filament emits electrons by thermionic emission. High DC potential difference (thousands of volts) accelerates electrons towards tungsten target, producing X-rays on collision.',
      'X-Ray Spectrum Types: 1. Continuous Spectrum (Bremsstrahlung / Braking Radiation): Produced when fast electrons are decelerated by Coulomb field of target nuclei. Independent of target material; depends only on tube accelerating voltage V: λ_min = (h × c) / (e × V). 2. Characteristic (Line) Spectrum: Produced when incoming electron knocks out inner K or L shell electron of tungsten atom, and outer electron falls down to fill vacancy emitting discrete X-ray photon. Depends ONLY on atomic number Z of target metal (higher Z shifts characteristic lines to shorter λ).'
    ],
    keyFormulas: [
      'Continuous min wavelength: λ_min = (h c) / (e V)',
      'e V = (1/2) m v² = h ν_max = (h c) / λ_min',
      'Line spectrum depends on target material (Z)'
    ],
    examTip: 'Increasing tube filament current increases INTENSITY of all X-rays without changing wavelengths. Increasing tube high voltage V decreases λ_min of continuous spectrum only.'
  },
  {
    pageNumber: 22,
    title: 'Laser Physics: Principles, Properties & Helium-Neon Laser',
    content: [
      'Laser (Light Amplification by Stimulated Emission of Radiation): Based on Stimulated Emission proposed by Einstein (incident photon of energy hν induces excited atom to drop before lifetime expires, emitting two identical coherent photons).',
      'Properties of Laser Light: 1. Monochromaticity (extremely narrow single spectral line). 2. Coherence (photons in phase in space and time). 3. Directionality (negligible beam divergence). 4. High Intensity (obeys not inverse square law due to parallelism).',
      'Three Laser Requirements: 1. Active medium (atoms to be excited). 2. Pumping energy source (optical, electrical, chemical). 3. Resonant cavity (mirrors reflecting beam back and forth for amplification). Population Inversion: State where number of excited atoms in metastable state exceeds ground state atoms.',
      'Helium-Neon Laser: Gas mixture (10 He : 1 Ne). Electric discharge excites Helium atoms by collision to metastable 20.61 eV. Excited He atoms collide inelastically with ground Ne atoms (close energy 20.66 eV), achieving population inversion in Neon. Red laser emitted at λ = 632.8 nm.'
    ],
    keyFormulas: [
      'E_Ne_excited - E_lower = h ν = (h c) / (632.8 nm)',
      'Holography: Uses laser coherence to record 3D images (amplitude and phase)',
      'Path difference = (λ / 2 π) × Phase difference'
    ],
    examTip: 'In He-Ne laser: Helium is the pumping agent; Neon is the actual laser emitter!'
  },
  {
    pageNumber: 23,
    title: 'Semiconductors, P-N Junction & Digital Logic Gates',
    content: [
      'Pure Semiconductor (Silicon): At 0 K, all covalent bonds intact; perfect insulator. Heating breaks bonds releasing electron-hole pairs (intrinsic conduction).',
      'Doping (Extrinsic Semiconductors): - N-type: Doped with pentavalent donor atoms (P, As, Sb). Majority carriers = electrons (n ≈ N_d⁺); minority = holes. - P-type: Doped with trivalent acceptor atoms (B, Al, Ga). Majority carriers = holes (p ≈ N_a⁻); minority = electrons. Law of Mass Action: n × p = n_i².',
      'P-N Junction (Diode): - Forward bias (P to +, N to -): Depletion layer thins, barrier voltage drops, conducts current. - Reverse bias (P to -, N to +): Depletion layer widens, blocks current. Used as AC Rectifier.',
      'Digital Logic Gates: - NOT gate (Inverter): Out = NOT In (1 -> 0, 0 -> 1). - AND gate: Out = 1 only if all inputs are 1. - OR gate: Out = 1 if ANY input is 1.'
    ],
    keyFormulas: [
      'Law of Mass Action: n × p = n_i²',
      'N-type: n ≈ N_d⁺ , p = n_i² / N_d⁺',
      'P-type: p ≈ N_a⁻ , n = n_i² / N_a⁻',
      'Diode: Conduction only in forward bias'
    ],
    examTip: 'Both N-type and P-type semiconductors are ELECTRICALLY NEUTRAL overall! Total positive charges equal total negative charges.'
  },
  {
    pageNumber: 24,
    title: 'The Master Cheat Sheet: Physics 2026 for Languages',
    content: [
      'Electricity & Magnetism Essentials: 1- Wire stretching: R2/R1 = (L2/L1)² = (r1/r2)⁴. 2- Voltmeter: V = V_B - Ir (discharging). 3- Mutual force: Newton\'s 3rd law holds regardless of current magnitudes. 4- Dynamo: Always use RMS values (eff = max / sqrt(2)) for power/heat calculations. 5- Resonance: f_0 = 1 / [ 2 π sqrt(LC) ], Z = R.',
      'Modern Physics Essentials: 1- Photoelectric effect: KE_max = h(ν - ν_c); intensity increases electron count, frequency increases kinetic energy. 2- Compton effect: photon speed is constant c; wavelength increases. 3- De Broglie: λ = h / (m v). 4- X-ray continuous minimum wavelength: λ_min = (h c) / (e V). 5- He-Ne Laser: He pumps, Ne emits 632.8 nm.',
      'Exam Day Tips: Check units carefully (convert cm to m, mA to A, eV to J). Double check angle definitions: torque uses normal to plane; moving wire uses angle between wire and field.'
    ],
    keyFormulas: [
      'R2/R1 = (L2/L1)²',
      'f_0 = 1 / [ 2 π sqrt(LC) ]',
      'KE_max = h ν - W_e',
      'λ_min = (h c) / (e V)',
      'λ = h / (m v)'
    ],
    examTip: 'Read questions thoroughly, sketch circuit loops and flux directions, write exact formulas before plugging numbers, and state proper SI units.'
  }
];
