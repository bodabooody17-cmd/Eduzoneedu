import { SummaryPage } from '../../types';

export const CHEMISTRY_LANG_PAGES_24: SummaryPage[] = [
  {
    pageNumber: 1,
    title: 'Transition Elements: Electronic Configuration & Atomic Properties',
    content: [
      'First Transition Series (3d): Elements from Scandium (21Sc) to Zinc (30Zn) located in Period 4, filling 3d sublevel. General valence configuration: [Ar] 4s¹⁻² 3d¹⁻¹⁰.',
      'Anomalous Electronic Configurations: 1. Chromium (24Cr): [Ar] 4s¹ 3d⁵ (half-filled 3d sublevel for extra stability). 2. Copper (29Cu): [Ar] 4s¹ 3d¹⁰ (completely filled 3d sublevel for maximum stability).',
      'Atomic Radii Constancy: From Chromium (24Cr) to Copper (29Cu), atomic radius remains remarkably constant due to two opposing factors: 1. Increasing nuclear charge pulling electrons inward. 2. Repulsion among increasing 3d electrons shielding the nucleus. This constancy makes them ideal for manufacturing substitute alloys.',
      'Melting and Boiling Points: Extremely high due to strong metallic bonding involving both 4s and 3d electrons in the electron sea.'
    ],
    keyFormulas: [
      'Cr: [Ar] 4s¹ 3d⁵ (Half-filled stability)',
      'Cu: [Ar] 4s¹ 3d¹⁰ (Filled stability)',
      'High metallic bond: 4s + 3d valence electrons'
    ],
    examTip: 'Why are transition elements used to make alloys? Because of the relative constancy of their atomic radii from Chromium to Copper!'
  },
  {
    pageNumber: 2,
    title: 'Oxidation States, Magnetic Properties & Catalytic Activity',
    content: [
      'Oxidation States: Transition elements exhibit variable oxidation states by losing 4s electrons first, then 3d electrons sequentially. - Scandium (Sc): only +3 ([Ar] 3d⁰). - Manganese (Mn): highest oxidation state (+7 in KMnO4, losing all 4s² 3d⁵). - Iron (Fe): exhibits +2 and +3, does not reach +8 because loss of all d-electrons requires immense ionization energy. +3 is more stable for Iron ([Ar] 3d⁵ half-filled).',
      'Magnetic Properties: 1. Paramagnetism: Attraction to external magnetic field due to presence of UNPAIRED electrons in 3d orbitals. Magnetic moment μ = sqrt[ n(n + 2) ] Bohr Magnetons, where n is number of unpaired electrons. Maximum paramagnetism is in Mn²⁺ and Fe³⁺ (n = 5). 2. Diamagnetism: Repulsion from external magnetic field due to complete pairing of electrons in all orbitals (n = 0, e.g. Zn, Zn²⁺, Sc³⁺, Cu⁺, Ti⁴⁺).',
      'Color of Transition Metal Ions: Arises from absorption of specific visible light photons that excite d-electrons between split d-orbitals. The eye perceives the COMPLEMENTARY color (e.g. absorbing Red appears Green; absorbing Blue appears Orange; absorbing Yellow appears Violet). Ions with empty 3d⁰ or full 3d¹⁰ are colorless.',
      'Catalytic Activity: Transition metals and their compounds are superior catalysts due to using 4s and 3d electrons to form weak temporary bonds with reactants on their surfaces, increasing concentration and lowering activation energy.'
    ],
    keyFormulas: [
      'Paramagnetic: Contains unpaired electrons (n > 0)',
      'Diamagnetic: All electrons paired (n = 0)',
      'Complementary colors: Red <-> Green, Blue <-> Orange, Yellow <-> Violet'
    ],
    examTip: 'Zn²⁺ and Sc³⁺ compounds are diamagnetic and COLORLESS because their 3d sublevels are either completely full (3d¹⁰) or completely empty (3d⁰).'
  },
  {
    pageNumber: 3,
    title: 'Extraction of Iron & Industrial Blast and Midrex Furnaces',
    content: [
      'Iron Ores: 1. Hematite (Fe₂O₃): Blood-red, easiest to reduce. 2. Magnetite (Fe₃O₄): Magnetic black oxide. 3. Limonite (2Fe₂O₃·3H₂O): Yellowish hydrated oxide. 4. Siderite (FeCO₃): Iron(II) carbonate.',
      'Ore Dressing: Physical processes (Crushing, Sizing/Screening, Sintering, Magnetic/Surface Tension Concentration) to increase iron percentage.',
      'Roasting Process: Heating ore strongly in air to: 1. Expel moisture (dehydrating Limonite to Hematite: 2Fe₂O₃·3H₂O -> 2Fe₂O₃ + 3H₂O). 2. Oxidize carbonates (2FeCO₃ -> 2FeO + CO₂; 4FeO + O₂ -> 2Fe₂O₃). 3. Oxidize harmful impurities (S + O₂ -> SO₂; 4P + 5O₂ -> 2P₂O₅).',
      'Iron Reduction Furnaces: 1. Blast Furnace: Reducing agent is Carbon Monoxide (CO), produced from coke: C + O₂ -> CO₂; CO₂ + C -> 2CO. Reaction: Fe₂O₃ + 3CO --(>700°C)--> 2Fe + 3CO₂. 2. Midrex Furnace: Reducing agent is Water Gas (CO + H₂), regenerated from natural gas (Methane CH₄) using ceramic reformer: 2CH₄ + CO₂ + H₂O -> 3CO + 5H₂. Reaction: 2Fe₂O₃ + 3CO + 3H₂ -> 4Fe + 3CO₂ + 3H₂O.'
    ],
    keyFormulas: [
      'Blast Furnace: Fe₂O₃ + 3CO -> 2Fe + 3CO₂ (> 700°C)',
      'Midrex: 2Fe₂O₃ + 3CO + 3H₂ -> 4Fe + 3CO₂ + 3H₂O',
      'Water gas from Methane: 2CH₄ + CO₂ + H₂O -> 3CO + 5H₂'
    ],
    examTip: 'Notice the difference in reducing agents: Blast Furnace uses pure CO (from coke); Midrex Furnace uses Water Gas CO + H₂ (from natural gas).'
  },
  {
    pageNumber: 4,
    title: 'Iron Oxides & Chemical Interconversions',
    content: [
      '1. Iron(II) Oxide (FeO): Black powder, insoluble in water. Prepared by heating iron(II) oxalate in absence of air: (COO)₂Fe --(no air)--> FeO + CO + CO₂ (CO prevents oxidation to Fe₂O₃). Reacts with dilute acids to give iron(II) salts: FeO + H₂SO₄ (dil) -> FeSO₄ + H₂O.',
      '2. Magnetic Iron Oxide (Fe₃O₄ / Magnetite): Mixed oxide (FeO·Fe₂O₃). Prepared by heating iron in air or steam to red heat (500°C): 3Fe + 2O₂ -> Fe₃O₄ ; 3Fe + 4H₂O -> Fe₃O₄ + 4H₂. Reacts with concentrated hot acids to give MIXTURE of Fe(II) and Fe(III) salts: Fe₃O₄ + 8HCl (conc) -> FeCl₂ + 2FeCl₃ + 4H₂O.',
      '3. Iron(III) Oxide (Fe₂O₃ / Hematite): Blood-red pigment. Prepared by: a) Heating Fe(OH)₃ above 200°C: 2Fe(OH)₃ -> Fe₂O₃ + 3H₂O. b) Heating iron(II) sulfate strongly: 2FeSO₄ --(Δ)--> Fe₂O₃ + SO₂ + SO₃. Reacts only with hot concentrated acids: Fe₂O₃ + 3H₂SO₄ (conc) -> Fe₂(SO₄)₃ + 3H₂O.',
      'Reduction of Iron Oxides by CO: Controlled by temperature! - Above 700°C: all oxides yield metallic Fe. - At 400°C - 700°C: Hematite or Magnetite reduces to FeO. - At 230°C - 300°C: Hematite reduces to Magnetic Fe₃O₄.'
    ],
    keyFormulas: [
      '2FeSO₄ --(Δ)--> Fe₂O₃ + SO₂ + SO₃',
      'Fe₃O₄ + 8HCl (conc) -> FeCl₂ + 2FeCl₃ + 4H₂O',
      'Reduction temp: >700°C -> Fe ; 400-700°C -> FeO ; 230-300°C -> Fe₃O₄'
    ],
    examTip: 'How to differentiate between FeO and Fe₂O₃? Add dilute HCl: FeO dissolves giving a light green solution, while Fe₂O₃ does not react with dilute acids at all!'
  },
  {
    pageNumber: 5,
    title: 'Qualitative Analysis: Anions of Dilute HCl Group',
    content: [
      'Concept: Stronger, more stable acids displace weaker, more volatile acids from their solid salts as gases that can be identified by characteristic reagents.',
      'Dilute HCl Group Anions: 1. Carbonate (CO₃²⁻) & Bicarbonate (HCO₃⁻): Dil. HCl yields effervescence with CO₂ gas, turning clear lime water (Ca(OH)₂) turbid due to formation of insoluble CaCO₃. Confirmatory test (MgSO₄ solution): Carbonate forms a WHITE precipitate in the cold (MgCO₃). Bicarbonate forms white ppt ONLY after boiling (Mg(HCO₃)₂ decomposes to MgCO₃).',
      '2. Sulfite (SO₃²⁻): Yields SO₂ gas with choking odor, turning paper wet with acidified potassium dichromate (K₂Cr₂O₇/H₂SO₄) from ORANGE to GREEN (Cr³⁺ formed). Confirmatory: AgNO₃ gives white ppt of Ag₂SO₃ turning black upon heating.',
      '3. Sulfide (S²⁻): Yields H₂S gas with rotten egg smell, turning paper wet with lead(II) acetate ((CH₃COO)₂Pb) BLACK due to PbS ppt. Confirmatory: AgNO₃ gives BLACK ppt of Ag₂S.',
      '4. Thiosulfate (S₂O₃²⁻): Yields SO₂ gas with yellow colloidal sulfur precipitate suspended in solution. Confirmatory: Iodine solution (brown) is decolorized.',
      '5. Nitrite (NO₂⁻): Yields colorless NO gas at mouth of tube turning reddish-brown NO₂ on contact with air. Confirmatory: Acidified KMnO₄ (purple) is decolorized.'
    ],
    keyFormulas: [
      'CO₂ + Ca(OH)₂ -> CaCO₃ (white ppt) + H₂O',
      'SO₂ turns K₂Cr₂O₇ Orange -> Green (Cr₂O₇²⁻ -> Cr³⁺)',
      'H₂S + Pb(CH₃COO)₂ -> PbS (black ppt) + 2CH₃COOH'
    ],
    examTip: 'To distinguish between Carbonate and Bicarbonate: Use Magnesium Sulfate (MgSO₄) solution. White ppt in cold = Carbonate; white ppt after heating = Bicarbonate.'
  },
  {
    pageNumber: 6,
    title: 'Qualitative Analysis: Anions of Conc. H₂SO₄ & BaCl₂ Groups',
    content: [
      'Conc. H₂SO₄ Group (More stable than halogen hydracids and nitric acid): 1. Chloride (Cl⁻): Colorless HCl gas fuming in moist air, forms dense white fumes of NH₄Cl with a glass rod dipped in ammonia solution (NH₄OH). Confirmatory (AgNO₃): White ppt of AgCl, turns violet in sunlight, completely soluble in conc. NH₄OH.',
      '2. Bromide (Br⁻): Gives HBr gas which is partially oxidized by conc. H₂SO₄ releasing ORANGE-RED bromine vapors (Br₂), turning starch paper YELLOW. Confirmatory (AgNO₃): Yellowish-white ppt of AgBr, slowly soluble in conc. NH₄OH.',
      '3. Iodide (I⁻): Gives HI gas oxidized to VIOLET iodine vapors (I₂), turning starch paper BLUE. Confirmatory (AgNO₃): YELLOW ppt of AgI, completely INSOLUBLE in conc. NH₄OH.',
      '4. Nitrate (NO₃⁻): Gives reddish-brown NO₂ vapors, intensified by adding copper turnings (Cu + 4HNO₃ -> Cu(NO₃)₂ + 2NO₂ + 2H₂O). Confirmatory (Brown Ring Test): Adding freshly prepared FeSO₄ and drops of conc. H₂SO₄ down tube wall forms a brown ring of [Fe(H₂O)₅(NO)]SO₄ at junction of layers, disappearing on shaking.',
      'Barium Chloride Group (BaCl₂): 1. Sulfate (SO₄²⁻): White ppt of BaSO₄ INSOLUBLE in dil. HCl. 2. Phosphate (PO₄³⁻): White ppt of Ba₃(PO₄)₂ SOLUBLE in dil. HCl.'
    ],
    keyFormulas: [
      'AgCl (White, dissolves rapidly in NH₄OH)',
      'AgBr (Yellowish-white, dissolves slowly in NH₄OH)',
      'AgI (Yellow, insoluble in NH₄OH)',
      'Brown Ring Complex: [Fe(H₂O)₅(NO)]SO₄'
    ],
    examTip: 'Distinguishing AgI from Ag₃PO₄: Both are yellow precipitates! AgI is INSOLUBLE in ammonia solution, while Ag₃PO₄ is SOLUBLE in ammonia solution and nitric acid.'
  },
  {
    pageNumber: 7,
    title: 'Qualitative Analysis: Basic Radicals (Cations Identification)',
    content: [
      'Cations classification depends on solubility of their chlorides, sulfides, hydroxides, and carbonates.',
      'Group II Cation: Copper(II) (Cu²⁺): Reagent is H₂S gas in acidic medium (dil. HCl). Forms BLACK precipitate of CuS, soluble in hot nitric acid.',
      'Group III Cations: Precipitated as hydroxides using Ammonium Hydroxide (NH₄OH): 1. Aluminum (Al³⁺): Gelatinous white ppt of Al(OH)₃, amphoteric, dissolving in excess NaOH forming soluble Sodium Meta-aluminate (NaAlO₂). 2. Iron(II) (Fe²⁺): Dirty greenish-white ppt of Fe(OH)₂, turns dark green in air, insoluble in excess NaOH. 3. Iron(III) (Fe³⁺): Reddish-brown gelatinous ppt of Fe(OH)₃, insoluble in excess NaOH.',
      'Group V Cation: Calcium (Ca²⁺): Reagent is Ammonium Carbonate (NH₄)₂CO₃. Forms white ppt of CaCO₃ soluble in dil. HCl and carbonic acid. Confirmatory: Flame test gives brick-red color; dil. H₂SO₄ gives white ppt of CaSO₄.'
    ],
    keyFormulas: [
      'Al(OH)₃ + NaOH -> NaAlO₂ + 2H₂O (Soluble meta-aluminate)',
      'Fe³⁺ + 3OH⁻ -> Fe(OH)₃ (Reddish-brown ppt)',
      'Flame test for Calcium: Brick-red flame'
    ],
    examTip: 'To distinguish between Fe²⁺ and Fe³⁺: Add NaOH. Dirty white ppt = Fe²⁺; Reddish-brown ppt = Fe³⁺.'
  },
  {
    pageNumber: 8,
    title: 'Quantitative Volumetric Analysis: Acid-Base Titration',
    content: [
      'Neutralization Titration Law: At the end point: (M_a × V_a) / n_a = (M_b × V_b) / n_b, where M_a, V_a are molarity and volume of acid; M_b, V_b are molarity and volume of base; n_a, n_b are stoichiometric coefficients from balanced equation.',
      'Indicators and pH Color Ranges: 1. Methyl Orange: Red in acid (pH < 3.1), Orange at neutrality, Yellow in base (pH > 4.4). 2. Litmus: Red in acid, Purple at neutrality, Blue in base. 3. Phenolphthalein: Colorless in acid and neutral, Pink in base (pH > 8.2). (Never use phenolphthalein to detect acidic solutions!). 4. Bromothymol Blue: Yellow in acid, Green at neutrality, Blue in base.',
      'Concentration and Mass Laws: - Number of moles = Molarity (M) × Volume (L) = Mass (g) / Molar Mass (g/mol). - Mass of substance (g) = Molarity × Volume (L) × Molar Mass. - Percentage purity = (Pure mass / Impure sample mass) × 100.'
    ],
    keyFormulas: [
      '(M_a V_a) / n_a = (M_b V_b) / n_b',
      'Mass = Molarity × Volume (L) × Molar Mass',
      '% Purity = (Pure mass / Total mass) × 100'
    ],
    examTip: 'Always balance the chemical equation first to determine n_a and n_b (e.g. for H₂SO₄ and NaOH, n_a = 1 and n_b = 2).'
  },
  {
    pageNumber: 9,
    title: 'Quantitative Gravimetric Analysis: Volatilization & Precipitation',
    content: [
      '1. Volatilization Method: Finding percentage of water of crystallization (hydration) in hydrated salts (e.g. hydrated copper sulfate CuSO₄·xH₂O or washing soda Na₂CO₃·xH₂O). Mass of water of crystallization = Mass of hydrated salt before heating - Mass of anhydrous salt after constant heating.',
      'Finding Hydration Number (x): x = (Moles of H₂O) / (Moles of anhydrous salt) = [ Mass of H₂O / 18 ] / [ Mass of anhydrous salt / Molar mass of anhydrous salt ].',
      '2. Gravimetric Precipitation Method: The desired constituent is precipitated as an insoluble compound of known chemical formula, filtered through ashless filter paper, washed, ignited, and weighed.',
      'Precipitation Calculation by Proportions: Using chemical stoichiometry: Moles/mass of target component = (Mass of precipitate obtained × Molar mass of target) / Molar mass of precipitate.'
    ],
    keyFormulas: [
      '% Water = (Mass of water / Mass of hydrated salt) × 100',
      'x = (Mass H₂O / 18) ÷ (Mass anhydrous / Molar Mass anhydrous)',
      'Moles = Mass / Molar Mass'
    ],
    examTip: 'To calculate x in hydrated salt: create a 2-column table (Anhydrous salt vs H₂O), list their masses, calculate moles (mass/molar mass), then divide both by the smaller number of moles.'
  },
  {
    pageNumber: 10,
    title: 'Chemical Equilibrium, Reaction Rate & Le Chatelier\'s Principle',
    content: [
      'Reversible Reactions: Proceed in both forward and backward directions, reaching dynamic equilibrium where forward rate equals backward rate (r_forward = r_backward) and concentrations of reactants and products remain constant (not necessarily equal!).',
      'Equilibrium Constant Kc: Kc = [Products]^coefficients / [Reactants]^coefficients. Solids (s) and pure liquids (l, like H₂O) are omitted from Kc expression because their concentrations are constant.',
      'Significance of Kc: - Kc > 1: Forward direction dominates (high yield of products). - Kc < 1: Backward direction dominates (reactants favored). Kc changes ONLY with temperature!',
      'Le Chatelier\'s Principle: If a dynamic equilibrium system is subjected to change in conditions (concentration, temperature, pressure), the system shifts in the direction that minimizes or opposes this change: 1. Concentration: Adding reactant shifts forward; removing product shifts forward. 2. Pressure: Affects gaseous systems with unequal moles (Δn != 0). Increasing pressure shifts equilibrium toward side with FEWER gas moles. 3. Temperature: In Exothermic reactions (ΔH < 0), heating shifts backward (Kc decreases). In Endothermic reactions (ΔH > 0), heating shifts forward (Kc increases).'
    ],
    keyFormulas: [
      'Kc = [C]^c [D]^d / [A]^a [B]^b',
      'Kp = (P_C)^c (P_D)^d / (P_A)^a (P_B)^b',
      'Exothermic: T increases => Kc decreases (shifts backward)'
    ],
    examTip: 'Catalysts DO NOT affect equilibrium position or Kc! They speed up forward and backward rates equally by lowering activation energy.'
  },
  {
    pageNumber: 11,
    title: 'Ionic Equilibrium: Weak Electrolytes, Ostwald\'s Law & pH',
    content: [
      'Weak Electrolytes: Partially ionized in aqueous solutions, reaching equilibrium between non-ionized molecules and ions. Ostwald\'s Dilution Law: At constant temperature, degree of ionization (α) increases as dilution increases (concentration C decreases): Ka = (α² × C) / (1 - α) ≈ α² × C (for weak acids where α << 1). Degree of ionization α = sqrt(Ka / C_a).',
      'Hydronium Ion Concentration [H₃O⁺]: In weak acid: [H₃O⁺] = sqrt(Ka × C_a) = α × C_a.',
      'Hydroxide Ion Concentration [OH⁻]: In weak base: [OH⁻] = sqrt(Kb × C_b) = α × C_b.',
      'The pH Scale: pH = - log [H₃O⁺] and pOH = - log [OH⁻]. Ionic Product of Water Kw = [H₃O⁺][OH⁻] = 10⁻¹⁴ at 25°C. Hence, pH + pOH = 14: - Acidic: pH < 7, [H₃O⁺] > 10⁻⁷ M. - Neutral: pH = 7, [H₃O⁺] = 10⁻⁷ M. - Basic: pH > 7, [H₃O⁺] < 10⁻⁷ M.'
    ],
    keyFormulas: [
      'Ostwald: α = sqrt(Ka / C_a)',
      '[H₃O⁺] = sqrt(Ka × C_a) = α C_a',
      '[OH⁻] = sqrt(Kb × C_b) = α C_b',
      'pH = - log [H₃O⁺] , pH + pOH = 14'
    ],
    examTip: 'If a strong diprotic acid like H₂SO₄ has concentration 0.05 M, [H₃O⁺] = 2 × 0.05 = 0.1 M, so pH = -log(0.1) = 1.'
  },
  {
    pageNumber: 12,
    title: 'Hydrolysis of Salts & Solubility Product (Ksp)',
    content: [
      'Salt Hydrolysis: Reaction between salt ions and water to produce parent acid and base: 1. Strong Acid + Weak Base (e.g. NH₄Cl): Acidic solution (pH < 7). NH₄⁺ removes OH⁻ forming weak NH₄OH, increasing [H⁺]. 2. Weak Acid + Strong Base (e.g. CH₃COONa): Basic solution (pH > 7). Acetate removes H⁺ forming weak CH₃COOH, increasing [OH⁻]. 3. Strong Acid + Strong Base (e.g. NaCl): Neutral (pH = 7). Neither ion reacts with water. 4. Weak Acid + Weak Base (e.g. CH₃COONH₄): Depends on Ka vs Kb (neutral if Ka = Kb).',
      'Solubility Product Constant (Ksp): Equilibrium constant between solid sparingly soluble salt and its dissolved ions in saturated solution: For salt A_x B_y (s) <=> x A^y⁺ + y B^x⁻, with solubility degree x mol/L: Ksp = [A^y⁺]^x [B^x⁻]^y = (x·x)^x · (y·x)^y.',
      'Examples: - Binary salt (AgCl): Ksp = x². Solubility x = sqrt(Ksp). - Ternary salt (PbCl₂ or Ag₂CrO₄): Ksp = (2x)² (x) = 4x³. Solubility x = (Ksp / 4)^(1/3).'
    ],
    keyFormulas: [
      'Binary (1:1): Ksp = x²',
      'Ternary (1:2): Ksp = 4 x³',
      'Precipitation occurs if Ionic Product Q > Ksp'
    ],
    examTip: 'To compare solubility of salts of DIFFERENT formulas (like AgCl and Ag₂S), do NOT compare Ksp values directly! Calculate the solubility degree x for each.'
  },
  {
    pageNumber: 13,
    title: 'Electrochemistry: Galvanic Cells & Standard Hydrogen Electrode',
    content: [
      'Galvanic (Voltaic) Cell: Converts spontaneous chemical redox energy into electric energy: - Anode: Negative electrode (-), where OXIDATION occurs (electron loss, corrosion). - Cathode: Positive electrode (+), where REDUCTION occurs (electron gain, mass deposition). - External circuit: Electrons flow from Anode to Cathode. - Salt Bridge (contains inert electrolyte like KNO₃ or Na₂SO₄): Maintains electrical neutrality by transferring anions toward anode half-cell and cations toward cathode half-cell.',
      'Standard Hydrogen Electrode (SHE): Potential E° = 0.00 V under standard conditions (1 atm H₂ gas, 1.0 M [H⁺], 25°C). Used as universal reference to measure standard electrode potentials.',
      'Electromotive Force (EMF, E°_cell): E°_cell = Standard Oxidation Potential of Anode + Standard Reduction Potential of Cathode = E°_red (Cathode) - E°_red (Anode). - If E°_cell > 0: Spontaneous reaction (Galvanic). - If E°_cell < 0: Non-spontaneous reaction (Electrolytic).'
    ],
    keyFormulas: [
      'E°_cell = E°_ox (anode) + E°_red (cathode)',
      'E°_cell = E°_red (cathode) - E°_red (anode)',
      'Spontaneous: E°_cell > 0'
    ],
    examTip: 'In the Electrochemical Series: Elements with highest oxidation potentials (top, like Li, K) are strongest reducing agents and act as anodes against any element below them.'
  },
  {
    pageNumber: 14,
    title: 'Primary and Secondary Commercial Batteries & Fuel Cell',
    content: [
      '1. Mercury Cell (Primary): Anode: Zn(Hg), Cathode: HgO/C, Electrolyte: KOH. Cell: Zn + HgO -> ZnO + Hg. EMF = 1.35 V. Used in hearing aids and watches. Mercury is toxic and must be disposed safely.',
      '2. Hydrogen Fuel Cell (Primary): Anode: H₂, Cathode: O₂, Electrolyte: Hot KOH. Overall: 2H₂ + O₂ -> 2H₂O. EMF = 1.23 V. Operates continuously as long as fuel is supplied without consuming electrode materials. Produces pure drinking water for astronauts.',
      '3. Lead-Acid Storage Battery (Car Battery, Secondary Reversible): Anode: Spongy Lead (Pb), Cathode: Lead Dioxide (PbO₂), Electrolyte: Dilute H₂SO₄ (Density = 1.28 - 1.30 g/cm³). Overall Discharge: Pb + PbO₂ + 2H₂SO₄ -> 2PbSO₄ + 2H₂O. EMF = 2.05 V per cell (12 V for 6 cells). Recharging: Connect to external DC source slightly higher than 12 V; reverses reaction regenerating Pb and PbO₂ and restoring acid density.',
      '4. Lithium-Ion Battery (Secondary): Lightest metal, highest standard oxidation potential (-3.04 V reduction). Anode: Lithium Graphite (LiC₆), Cathode: Lithium Cobalt Oxide (LiCoO₂), Electrolyte: Nonaqueous LiPF₆. EMF = 3.0 V.'
    ],
    keyFormulas: [
      'Lead battery discharge: Pb + PbO₂ + 2H₂SO₄ -> 2PbSO₄ + 2H₂O (12 V)',
      'Fuel cell: 2H₂ + O₂ -> 2H₂O (E = 1.23 V)',
      'Hydrometer: Battery depleted if acid density < 1.20 g/cm³'
    ],
    examTip: 'During discharge of car battery: H₂SO₄ is consumed, producing H₂O, so acid density decreases, internal resistance increases, and voltage drops.'
  },
  {
    pageNumber: 15,
    title: 'Corrosion of Metals & Protection Methods',
    content: [
      'Mechanism of Iron Rusting: Spontaneous electrochemical cell formed when iron is exposed to moisture and oxygen: - Anode: Iron corrodes: 2Fe -> 2Fe²⁺ + 4e⁻. - Cathode: Oxygen dissolved in water reduces: O₂ + 2H₂O + 4e⁻ -> 4OH⁻. - Precipitation: Fe²⁺ + 2OH⁻ -> Fe(OH)₂ (dirty white). - Oxidation to rust: Fe(OH)₂ is oxidized by dissolved O₂ to hydrated Iron(III) oxide (Rust): 2Fe(OH)₃ / Fe₂O₃·xH₂O.',
      'Factors Accelerating Rust: Impurities in iron, salinity of water, contact between dissimilar metals (galvanic couple).',
      'Metal Protection Methods: 1. Organic Coating: Paint, varnish, grease (temporary). 2. Cathodic Protection (Tinning Iron): Coating with less active metal (Sn). If scratched, iron is more active, acts as anode and corrodes faster than unprotected iron! 3. Anodic Protection (Galvanization): Coating iron with more active metal (Zinc). If scratched, zinc acts as sacrificial anode and corrodes first, protecting iron.',
      'Sacrificial Anode: Magnesium blocks connected to buried iron pipelines or ship hulls to sacrifice themselves and protect the iron.'
    ],
    keyFormulas: [
      'Rust overall: 2Fe + 3/2 O₂ + 3H₂O -> 2Fe(OH)₃ (Rust)',
      'Anodic protection: Coating with more active metal (Zinc)',
      'Sacrificial anode: Mg or Zn connected to Iron'
    ],
    examTip: 'Why is zinc coating (galvanization) superior to tin coating? Because zinc is more active (anodic), protecting iron even when scratched; whereas tin accelerates iron rust when scratched!'
  },
  {
    pageNumber: 16,
    title: 'Electrolysis & Faraday\'s Quantitative Laws',
    content: [
      'Faraday\'s First Law: Mass of substance deposited or liberated at any electrode is directly proportional to quantity of electricity (Q = I × t) passing through electrolyte.',
      'Faraday\'s Second Law: Masses of different substances liberated by the same quantity of electricity are directly proportional to their Gram Equivalent Masses: Equivalent Mass = Molar Mass / Valence (z).',
      'Faraday\'s Constant (F): 1 Faraday = 96,500 Coulombs. The quantity of electricity required to liberate one gram equivalent mass of ANY element.',
      'The Universal Faraday Formula: Mass deposited (g) = (Molar Mass × Current I × Time t) / (Valence z × 96500) = (Equivalent Mass × Q) / 96500.',
      'Gas Volumes at STP: 1 Faraday liberates (22.4 / z) liters of monoatomic gas, or (22.4 / 2z) liters of diatomic gas (like H₂, Cl₂, O₂). To liberate 1 mole of diatomic gas X₂ requires 2z Faradays (e.g. 1 mole O₂ requires 4 Faradays; 1 mole Cl₂ requires 2 Faradays).'
    ],
    keyFormulas: [
      'Equivalent Mass = Molar Mass / Valence (z)',
      'Mass = (Molar Mass × I × t) / (z × 96500)',
      '1 Faraday = 96,500 Coulombs',
      '1 mole O₂ gas = 4 Faradays (4 × 96,500 C)'
    ],
    examTip: 'To liberate 1 mole of Oxygen gas (O₂): Valence of oxygen is 2, and molecule is diatomic, so it needs 2 × 2 = 4 Faradays!'
  },
  {
    pageNumber: 17,
    title: 'Organic Chemistry: Hydrocarbons Classification & IUPAC Rules',
    content: [
      'Wöhler\'s Breakthrough (1828): Synthesized organic compound (Urea) from inorganic ammonium cyanate by heating, destroying the "Vital Force Theory": NH₄CNO --(Δ)--> (NH₂)₂CO (Urea).',
      'Classification of Hydrocarbons: 1. Aliphatic: Open chain (Alkanes CnH2n+2, Alkenes CnH2n, Alkynes CnH2n-2) and Cyclic (Cycloalkanes CnH2n). 2. Aromatic: Benzene ring compounds (Benzene C₆H₆, Naphthalene C₁₀H₈).',
      'IUPAC Nomenclature Principles: 1. Identify the longest continuous carbon chain containing the functional group (double/triple bond or main group). 2. Number the chain from the end closer to the functional group (or closer to substituents if symmetrical). 3. List substituent alkyl groups in ALPHABETICAL order with position numbers (e.g. 4-ethyl-2-methylhexane). 4. Use prefixes di-, tri-, tetra- for identical substituents.',
      'Isomerism: Compounds having the same molecular formula but different structural formulas, resulting in different physical and chemical properties.'
    ],
    keyFormulas: [
      'Wöhler: NH₄CNO --(Δ)--> CO(NH₂)₂ (Urea)',
      'Alkanes: C_n H_(2n+2) (Saturated, single bonds)',
      'Alkenes: C_n H_(2n) (Double bond)',
      'Alkynes: C_n H_(2n-2) (Triple bond)'
    ],
    examTip: 'In IUPAC naming: Alphabetical order of substituents takes precedence when writing the name (Ethyl comes before Methyl), regardless of their position numbers!'
  },
  {
    pageNumber: 18,
    title: 'Alkanes (Methane) & Cycloalkanes',
    content: [
      'Alkanes (Paraffins): Saturated open-chain hydrocarbons (CnH2n+2) with strong, non-polar single sigma (σ) bonds; chemically inert at room temperature.',
      'Methane (CH₄): Marshes gas. Prepared in lab by Dry Distillation of anhydrous sodium acetate with soda lime (NaOH + CaO): CH₃COONa + NaOH --(CaO, Δ)--> CH₄ + Na₂CO₃. (Soda lime lowers the melting mixture point).',
      'Chemical Reactions of Alkanes: 1. Combustion: CH₄ + 2O₂ -> CO₂ + 2H₂O + Energy. 2. Halogenation (Substitution / Free Radical): CH₄ + Cl₂ --(UV / 400°C)--> CH₃Cl -> CH₂Cl₂ -> CHCl₃ (Chloroform) -> CCl₄. 3. Thermal Cracking at 1000°C in absence of air: CH₄ -> C (Carbon black for tires/ink) + 2H₂. 4. Reaction with steam at 725°C with catalyst: CH₄ + H₂O -> CO + 3H₂ (Water gas).',
      'Cycloalkanes (CnH2n, n >= 3): Ring stability depends on bond angles: - Cyclopropane (60°) & Cyclobutane (90°): Highly strained, active and explosive with air. - Cyclopentane (108°) & Cyclohexane (109.5°): Stable and inactive due to tetrahedral angles.'
    ],
    keyFormulas: [
      'Dry distillation: CH₃COONa + NaOH -> CH₄ + Na₂CO₃',
      'Halogenation requires UV light or 400°C',
      'Cyclopropane (60° ring strain) > Cyclohexane (109.5° stable)'
    ],
    examTip: 'Why is soda lime (NaOH + CaO) used instead of pure caustic soda? Because Quicklime CaO acts as a flux that lowers the melting point of the mixture.'
  },
  {
    pageNumber: 19,
    title: 'Alkenes (Ethene) & Markovnikov\'s Rule',
    content: [
      'Alkenes (Olefins, CnH2n): Unsaturated hydrocarbons with one double bond (one strong σ bond and one weak easily broken π bond).',
      'Ethene (C₂H₄): Prepared by dehydration of ethanol with concentrated H₂SO₄ at 180°C: C₂H₅OH --(conc H₂SO₄, 180°C)--> C₂H₄ + H₂O. (Occurs via ethyl hydrogen sulfate at 80°C).',
      'Addition Reactions: 1. Hydrogenation: C₂H₄ + H₂ --(Ni, 150-300°C)--> C₂H₆. 2. Halogenation: C₂H₄ + Br₂ (in CCl₄, red) -> 1,2-dibromoethane (colorless; test for unsaturation!).',
      'Markovnikov\'s Rule: When an asymmetric reagent (H-X or H-OH) is added to an asymmetric alkene, the positive hydrogen atom (H⁺) attaches to the carbon atom already holding the GREATER number of hydrogen atoms ("the rich gets richer"), while the negative group (X⁻ or OH⁻) attaches to the carbon with fewer hydrogen atoms.',
      'Oxidation (Baeyer\'s Test): Ethene + H₂O + [O] --(alkaline KMnO₄)--> Ethylene Glycol (1,2-ethanediol, antifreeze). Purple color of KMnO₄ disappears.'
    ],
    keyFormulas: [
      'Dehydration: C₂H₅OH --(180°C)--> C₂H₄ + H₂O',
      'Baeyer Test: Alkaline KMnO₄ purple disappears -> Diol formed',
      'Markovnikov: Propene + HBr -> 2-bromopropane (NOT 1-bromopropane)'
    ],
    examTip: 'Addition of HBr to Propene yields 2-bromopropane exclusively, because H attaches to CH₂ (richer in H) and Br attaches to CH according to Markovnikov\'s rule.'
  },
  {
    pageNumber: 20,
    title: 'Alkynes (Ethyne / Acetylene) & Aromatic Benzene',
    content: [
      'Alkynes (CnH2n-2): Contain one triple bond (one σ bond and two weak π bonds).',
      'Ethyne (C₂H₂): Prepared in lab by dripping water on Calcium Carbide: CaC₂ + 2H₂O -> C₂H₂ + Ca(OH)₂. In industry by thermal shock of methane: 2CH₄ --(1500°C, rapid quench)--> C₂H₂ + 3H₂.',
      'Combustion: In limited oxygen burns with smoky flame; in excess oxygen burns with oxy-acetylene flame (3000°C) used in cutting and welding metals.',
      'Catalytic Hydration: C₂H₂ + H₂O --(40% H₂SO₄, 1% HgSO₄, 60°C)--> Acetaldehyde (Ethanal, CH₃CHO). Oxidation yields Acetic Acid; reduction yields Ethanol.',
      'Aromatic Benzene (C₆H₆): Resonating hybrid structure (Kekulé), alternating single and double bonds (bond length 1.39 Å intermediate). Prepared by: Cyclic trimerization of acetylene in red-hot nickel tube: 3C₂H₂ -> C₆H₆; or Catalytic reforming of n-hexane: C₆H₁₄ -> C₆H₆ + 4H₂.',
      'Electrophilic Substitution of Benzene: Halogenation (Cl₂/FeCl₃ -> Chlorobenzene), Nitration (HNO₃/H₂SO₄ -> Nitrobenzene), Alkylation / Friedel-Crafts (CH₃Cl/AlCl₃ -> Toluene).'
    ],
    keyFormulas: [
      'Lab prep: CaC₂ + 2H₂O -> C₂H₂ + Ca(OH)₂',
      'Catalytic hydration: C₂H₂ + H₂O -> CH₃CHO (Ethanal)',
      'Friedel-Crafts: C₆H₆ + CH₃Cl --(AlCl₃)--> C₆H₅CH₃ + HCl'
    ],
    examTip: 'Catalytic hydration of ethyne gives Acetaldehyde (Ethanal), which is the primary gateway to both acetic acid (by oxidation) and ethanol (by reduction).'
  },
  {
    pageNumber: 21,
    title: 'Alcohols & Phenols: Classification & Reactions',
    content: [
      'Classification of Alcohols: By number of OH groups: Monohydric (Ethanol), Dihydric (Ethylene glycol), Trihydric (Glycerol), Polyhydric (Sorbitol, Glucose). By carbinol carbon (C-OH): - Primary (1°): Carbinol attached to 2 H atoms (R-CH₂-OH). Oxidizes in two steps: Alcohol -> Aldehyde -> Carboxylic acid. - Secondary (2°): Carbinol attached to 1 H atom (R₂-CH-OH). Oxidizes in one step to Ketone. - Tertiary (3°): Carbinol attached to 0 H atoms (R₃-C-OH). Resists oxidation under normal conditions.',
      'Ethanol (C₂H₅OH): Prepared by alcoholic fermentation of molasses (Sucrose -> Glucose/Fructose -> Ethanol + CO₂ using zymase enzyme from yeast), or catalytic hydration of ethene. Tested by acidified K₂Cr₂O₇ (Orange -> Green) or KMnO₄ (Purple disappears).',
      'Phenols (Carbolic Acid C₆H₅OH): Weakly acidic (stronger acid than alcohols due to benzene ring drawing electrons, weakening O-H bond). Reacts with NaOH (unlike alcohols): C₆H₅OH + NaOH -> C₆H₅ONa + H₂O. Tests: 1. With FeCl₃ solution: Violet color. 2. With Bromine water: White precipitate.'
    ],
    keyFormulas: [
      '1° Alcohol: R-CH₂OH --[O]--> R-CHO --[O]--> R-COOH',
      '2° Alcohol: R-CH(OH)-R --[O]--> R-CO-R (Ketone)',
      'Phenol test: FeCl₃ -> Violet color ; Bromine water -> White ppt'
    ],
    examTip: 'Tertiary alcohols (like 2-methyl-2-propanol) DO NOT oxidize with acidified potassium dichromate because the carbinol carbon carries no hydrogen atoms!'
  },
  {
    pageNumber: 22,
    title: 'Carboxylic Acids: Aliphatic & Aromatic Properties',
    content: [
      'Functional Group: Carboxyl group (-COOH), consisting of carbonyl (C=O) and hydroxyl (-OH). Acids form intermolecular hydrogen bonds (two H-bonds per pair of molecules), giving them higher boiling points than corresponding alcohols!',
      'Acidity Reactions: 1. With active metals (Na, Mg): liberates H₂ gas. 2. With carbonates/bicarbonates (Acidity Test): violent effervescence of CO₂ gas. 3. Esterification: Acid + Alcohol <=(conc H₂SO₄)=> Ester + H₂O.',
      'Acetic Acid (Ethanoic CH₃COOH): Glacial at 16.6°C (crystallizes like ice). Prepared by oxidation of ethanol or acetaldehyde.',
      'Aromatic Acids (Benzoic C₆H₅COOH): Stronger and less soluble in water than aliphatic acids. Tested by iron(III) chloride (buff precipitate of iron(III) benzoate).',
      'Medical Acids: - Acetylsalicylic acid (Aspirin): Prepared from salicylic acid + acetic acid. - Methyl salicylate (Oil of Wintergreen): Prepared from salicylic acid + methanol; topical analgesic.'
    ],
    keyFormulas: [
      'Esterification: R-COOH + R\'-OH <=> R-COO-R\' + H₂O',
      'Aspirin: Salicylic acid + Acetic anhydride -> Acetylsalicylic acid',
      'Boiling point: Carboxylic acid > Alcohol (Forms dimer with 2 H-bonds)'
    ],
    examTip: 'In esterification reaction: The water molecule H₂O is formed by removing the OH from the ACID and the H from the ALCOHOL (proven by oxygen-18 isotope tracing)!'
  },
  {
    pageNumber: 23,
    title: 'Esters, Fats, Saponification & Biodegradable Polymers',
    content: [
      'Esters (R-COO-R\'): Characteristic pleasant odors of fruits and flowers. Boiling points lower than acids and alcohols due to absence of hydroxyl hydrogen bonds.',
      'Reactions of Esters: 1. Acid Hydrolysis: Ester + H₂O --(H⁺)--> Acid + Alcohol. 2. Alkaline Hydrolysis (Saponification): Ester + NaOH -> Sodium Salt of Acid (Soap) + Alcohol. 3. Ammonolysis: Ester + NH₃ -> Acid Amide + Alcohol (e.g. Ethyl acetate + NH₃ -> Acetamide CH₃CONH₂ + C₂H₅OH).',
      'Fats and Oils: Triesters of glycerol with heavy long-chain fatty acids (Triglycerides). Saponification of fats with NaOH produces Soap and Glycerol.',
      'Polyesters (Dacron): Condensation polymer of Terephthalic acid and Ethylene glycol. Inert, used in artificial heart valves and arterial grafts.',
      'Phenol-Formaldehyde Polymer (Bakelite): Cross-linked thermosetting plastic, heat-resistant and electrical insulator used in electrical sockets and ashtrays.'
    ],
    keyFormulas: [
      'Ammonolysis: R-COOR\' + NH₃ -> R-CONH₂ (Amide) + R\'OH',
      'Saponification: Fat + 3NaOH -> Soap + Glycerol',
      'Dacron: Terephthalic acid + Ethylene glycol'
    ],
    examTip: 'Ammonolysis of an ester always yields an Acid Amide + Alcohol! Ethyl benzoate with ammonia gives Benzamide (C₆H₅CONH₂) + Ethanol.'
  },
  {
    pageNumber: 24,
    title: 'The Master Cheat Sheet: Chemistry 2026 for Languages',
    content: [
      'Transition Metals: Sc only +3; Cr is 4s¹ 3d⁵; Cu is 4s¹ 3d¹⁰. Blast furnace uses CO from coke; Midrex uses Water Gas (CO + H₂) from CH₄. FeSO₄ decomposes to Fe₂O₃ + SO₂ + SO₃.',
      'Analytical Chemistry: Carbonate vs Bicarbonate with MgSO₄ (cold vs hot). AgCl white dissolves in NH₄OH; AgBr yellowish dissolves slowly; AgI yellow insoluble. Brown ring: [Fe(H₂O)₅(NO)]SO₄. Neutralization: (Ma Va)/na = (Mb Vb)/nb.',
      'Equilibrium & Electrochemistry: Le Chatelier: Exothermic reaction heating lowers Kc. Weak acid [H⁺] = sqrt(Ka Ca). Lead battery: Pb + PbO₂ + 2H₂SO₄ -> 2PbSO₄ + 2H₂O. Faraday: 1 F = 96,500 C; O₂ needs 4 F per mole.',
      'Organic Chemistry: Wöhler synthesized Urea. Markovnikov: H goes to carbon with more H. Baeyer test: Alkaline KMnO₄ decolorized by alkenes. Alcohols: 1° -> Acid; 2° -> Ketone; 3° -> no oxidation. Phenol: FeCl₃ gives violet color.'
    ],
    keyFormulas: [
      '(M_a V_a)/n_a = (M_b V_b)/n_b',
      '[H⁺] = sqrt(Ka C_a)',
      'Mass = (Molar Mass × I × t) / (z × 96500)',
      'Markovnikov addition: 2-bromopropane'
    ],
    examTip: 'Write balanced equations for every reaction, include catalysts and temperatures (like conc H₂SO₄ at 180°C), and double-check oxidation states!'
  }
];
