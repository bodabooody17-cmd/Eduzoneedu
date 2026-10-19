import { SummaryPage } from '../../types';

export const STATICS_LANG_PAGES_24: SummaryPage[] = [
  {
    pageNumber: 1,
    title: 'Concepts of Friction, Limiting Static Friction & Coefficient of Friction',
    content: [
      'Concept of Friction: When two rough surfaces are in contact, microscopic irregularities interlock, generating a resistive force parallel to the contact surface opposing the impending motion.',
      'Static Friction Force (Fs): A self-adjusting force ranging from 0 <= Fs <= Fs_max. It matches the applied tangential force until motion is on the verge of occurring.',
      'Limiting Static Friction (Fs_max): The maximum static friction force attained when the body is on the verge of slipping. Law: Fs_max = mu_s * R, where mu_s is the coefficient of static friction and R is the normal reaction.',
      'Kinetic Friction Force (Fk): Once motion begins, the friction drops to kinetic friction: Fk = mu_k * R, where mu_k < mu_s always.',
      'Properties of mu_s: Depends purely on the nature and materials of the two surfaces in contact; independent of the contact surface area.',
    ],
    keyFormulas: [
      'Fs <= mu_s * R',
      'Fs_max = mu_s * R',
      'Fk = mu_k * R (mu_k < mu_s)',
      'mu_s = tan(lambda)',
    ],
    examTip:
      'Never substitute Fs = mu_s * R unless the problem explicitly states that the body is "on the verge of motion" or "about to slip". Otherwise, use Fs as an unknown variable and verify Fs <= mu_s * R!',
  },
  {
    pageNumber: 2,
    title: 'Resultant Reaction (R\') & Angle of Friction (lambda)',
    content: [
      'Normal Reaction (R): The perpendicular component of the total contact reaction exerted by the plane on the body.',
      'Total / Resultant Reaction (R\'): The vector sum of the normal reaction R and the friction force Fs: R\' = R + Fs (vectors). Magnitude: R\' = sqrt(R^2 + Fs^2).',
      'Limiting Resultant Reaction (R\'_max): When limiting equilibrium is reached: R\'_max = sqrt(R^2 + (mu_s * R)^2) = R * sqrt(1 + mu_s^2).',
      'Angle of Friction (lambda): The angle between the normal reaction R and the limiting resultant reaction R\'_max when the body is on the verge of motion.',
      'Relation: tan(lambda) = Fs_max / R = (mu_s * R) / R = mu_s. Also R\'_max = R * sec(lambda).',
      'Range of Resultant Reaction: In general, R\' in (R, R * sec(lambda)] or [R, R * sqrt(1 + mu_s^2)].',
    ],
    keyFormulas: [
      'R\' = sqrt(R^2 + Fs^2)',
      'R\'_max = R * sqrt(1 + mu_s^2) = R * sec(lambda)',
      'tan(lambda) = mu_s',
      'R < R\' <= R * sec(lambda)',
    ],
    examTip:
      'If friction is zero (smooth surface), lambda = 0 and R\' = R. On a rough surface with impending motion, R\' always acts at angle lambda to the normal!',
  },
  {
    pageNumber: 3,
    title: 'Equilibrium of a Body on a Rough Horizontal Plane',
    content: [
      'Horizontal Pulling Force (P): Resolving forces: Vertically: R = W (Weight). Horizontally: P = Fs. If on the verge of motion: P = mu_s * R = mu_s * W.',
      'Inclined Pulling Force (P at angle theta to the horizontal): Resolving P into components: Horizontal: P * cos(theta), Vertical: P * sin(theta) upwards. Equations of equilibrium: R + P * sin(theta) = W => R = W - P * sin(theta). Along the plane: P * cos(theta) = Fs. If about to slip: P * cos(theta) = mu_s * (W - P * sin(theta)).',
      'Inclined Pushing Force (P downwards at angle theta): R = W + P * sin(theta), P * cos(theta) = mu_s * (W + P * sin(theta)). Notice normal reaction increases due to downward thrust.',
      'Least Force to make body on the verge of motion: P_min = W * sin(lambda) applied at angle theta = lambda to the horizontal!',
    ],
    keyFormulas: [
      'R = W - P * sin(theta)',
      'P * cos(theta) = mu_s * (W - P * sin(theta))',
      'P = (mu_s * W) / (cos(theta) + mu_s * sin(theta))',
      'P_min = W * sin(lambda) at angle theta = lambda',
    ],
    examTip:
      'To find the least force to move a body on a rough horizontal plane, set theta = lambda (the angle of friction), yielding P_min = W * sin(lambda). Remember this directly for MCQ exams!',
  },
  {
    pageNumber: 4,
    title: 'Body on a Rough Inclined Plane Under Its Weight Alone',
    content: [
      'Let the plane be inclined at angle theta to the horizontal. The weight W resolves into: W * sin(theta) down the plane, and W * cos(theta) perpendicular into the plane.',
      'Normal reaction: R = W * cos(theta). Tangential component down the plane = W * sin(theta).',
      'Case 1: theta < lambda: Body remains in static equilibrium without slipping; Fs = W * sin(theta) < mu_s * R.',
      'Case 2: theta = lambda: Body is on the verge of slipping downwards under its own weight alone. Here tan(theta) = tan(lambda) = mu_s.',
      'Case 3: theta > lambda: Body accelerates downwards; static equilibrium is impossible without an external upward supporting force.',
    ],
    keyFormulas: [
      'R = W * cos(theta)',
      'Fs = W * sin(theta)',
      'If about to slip under gravity: tan(theta) = mu_s',
      'theta = lambda',
    ],
    examTip:
      'If a body is placed on an incline and is on the verge of slipping under its own weight only, the inclination angle theta equals the angle of friction lambda directly!',
  },
  {
    pageNumber: 5,
    title: 'Force Acting on Body on an Inclined Plane Along Line of Greatest Slope',
    content: [
      'Case A: Force P prevents body from slipping downwards (least force for equilibrium): Impending motion is downwards => Friction force Fs acts upwards along the incline. Equation: P + mu_s * R = W * sin(theta) => P_least = W * sin(theta) - mu_s * W * cos(theta). Using lambda: P = W * sin(theta - lambda) / cos(lambda).',
      'Case B: Force P makes body on the verge of moving upwards (greatest force for equilibrium): Impending motion is upwards => Friction force acts downwards along the incline. Equation: P = W * sin(theta) + mu_s * R => P_greatest = W * sin(theta) + mu_s * W * cos(theta). Using lambda: P = W * sin(theta + lambda) / cos(lambda).',
      'Range of equilibrium force: P_least <= P <= P_greatest for the body to remain at rest.',
    ],
    keyFormulas: [
      'P_down = W * sin(theta) - mu_s * W * cos(theta)',
      'P_up = W * sin(theta) + mu_s * W * cos(theta)',
      'P_least = W * sin(theta - lambda) / cos(lambda)',
      'P_greatest = W * sin(theta + lambda) / cos(lambda)',
    ],
    examTip:
      'Always determine the direction of impending motion first. Friction always acts in the opposite direction to impending motion, never assume it is always up the incline!',
  },
  {
    pageNumber: 6,
    title: 'Horizontal Force Acting on a Body on a Rough Inclined Plane',
    content: [
      'Let horizontal force P push towards the incline. Resolving P: P * cos(theta) up along the line of greatest slope, and P * sin(theta) perpendicular into the incline.',
      'Normal Reaction: R = W * cos(theta) + P * sin(theta).',
      'If body is on verge of moving upwards: P * cos(theta) = W * sin(theta) + mu_s * R = W * sin(theta) + mu_s * (W * cos(theta) + P * sin(theta)).',
      'If body is on verge of slipping downwards: P * cos(theta) + mu_s * R = W * sin(theta).',
      'Lami\'s Theorem Application: When three coplanar forces (W, P, R\') maintain equilibrium on an incline, R\' acts at angle (90 - theta +- lambda) and forces can be solved instantly via sine ratios!',
    ],
    keyFormulas: [
      'R = W * cos(theta) + P * sin(theta)',
      'Upwards: P * cos(theta) = W * sin(theta) + mu_s * R',
      'Downwards: P * cos(theta) + mu_s * R = W * sin(theta)',
    ],
    examTip:
      'Because P is horizontal, its perpendicular component adds to the weight component, increasing R and therefore substantially increasing the maximum available friction mu_s * R!',
  },
  {
    pageNumber: 7,
    title: 'Moments of Forces in 2D (Scalar & Vector Definition)',
    content: [
      'Vector Definition: The moment of a force F acting through point A with respect to point O is defined as: M_O = r x F, where r = OA = vector from the moment center O to any point A on the line of action of F.',
      'Scalar Magnitude: |M_O| = |r| * |F| * sin(alpha) = F * L, where L = perpendicular distance from O to the line of action of F (lever arm).',
      'Sign Convention: Positive for counter-clockwise rotation (+), negative for clockwise rotation (-).',
      'Zero Moment: M_O = 0 if and only if: 1. F = 0, or 2. O lies on the line of action of F (perpendicular distance L = 0).',
    ],
    keyFormulas: [
      'M_O = r x F',
      '|M_O| = F * L = F * |r| * sin(alpha)',
      'L = |M_O| / |F|',
      'M_O = (x * Fy - y * Fx) * k (in 2D xy-plane)',
    ],
    examTip:
      'The position vector r MUST start from the center of moments O and end at the point of action A (r = A - O), never reverse it to O - A or the sign will invert!',
  },
  {
    pageNumber: 8,
    title: 'Varignon\'s Theorem of Moments & Geometric Properties',
    content: [
      'Varignon\'s Theorem: The algebraic sum of the moments of a system of concurrent coplanar forces about any point O in their plane is equal to the moment of their resultant R about the same point O: sum(M_O(F_i)) = M_O(R).',
      'Practical Importance: Instead of calculating the complex perpendicular distance to an inclined force, resolve the force into rectangular components (Fx, Fy) at a convenient point on its line of action: M_O = x * Fy - y * Fx.',
      'Line parallel to Resultant: If M_A = M_B (and A != B), then the line AB is parallel to the line of action of the resultant R.',
      'Line bisected by Resultant: If M_A = -M_B, then the line segment AB is bisected by the line of action of the resultant R.',
      'Collinear Points: If M_A = M_B = M_C, then the forces are equivalent to a couple or in equilibrium.',
    ],
    keyFormulas: [
      'sum(M_O) = r x R = M_O(R)',
      'M_A = M_B <=> AB // Line of Action of R',
      'M_A = -M_B <=> Resultant bisects AB at midpoint M = (A + B)/2',
      'M_A = 0 <=> Line of action of R passes through A',
    ],
    examTip:
      'Memorize these golden theorems: M_A = M_B means R is parallel to AB. M_A = -M_B means R passes through the midpoint of AB!',
  },
  {
    pageNumber: 9,
    title: 'Moments of Forces in 3D Cartesian Space',
    content: [
      'Let force F = Fx * i + Fy * j + Fz * k act at point A(xA, yA, zA). To find the moment of F about origin O(0,0,0) or point B(xB, yB, zB):',
      'Position vector r = BA = (xA - xB) * i + (yA - yB) * j + (zA - zB) * k = (rx, ry, rz).',
      'Cross product via 3x3 Determinant: M_B = r x F = det([i, j, k; rx, ry, rz; Fx, Fy, Fz]).',
      'Components: M_B = (ry * Fz - rz * Fy) * i - (rx * Fz - rz * Fx) * j + (rx * Fy - ry * Fx) * k.',
      'Moment of F about Coordinate Axes: Moment about x-axis = (ry * Fz - rz * Fy). Moment about y-axis = (rz * Fx - rx * Fz). Moment about z-axis = (rx * Fy - ry * Fx).',
      'Perpendicular distance from B to line of action of F: L = |M_B| / |F| = sqrt(Mx^2 + My^2 + Mz^2) / sqrt(Fx^2 + Fy^2 + Fz^2).',
    ],
    keyFormulas: [
      'M_B = r x F = det([i, j, k; rx, ry, rz; Fx, Fy, Fz])',
      'Mx = ry * Fz - rz * Fy',
      'My = rz * Fx - rx * Fz',
      'Mz = rx * Fy - ry * Fx',
      'L = |M_B| / |F|',
    ],
    examTip:
      'To find the moment of a force about a line or axis (e.g. z-axis), calculate the total moment vector M_O and take the dot product with the unit vector along that line: M_axis = M_O . u_axis!',
  },
  {
    pageNumber: 10,
    title: 'Parallel Coplanar Forces (Like & Unlike)',
    content: [
      'Like Parallel Forces: Two forces F1 and F2 having the same direction acting at points A and B respectively. 1. Resultant R has magnitude: R = F1 + F2, same direction. 2. Point of action C lies on segment AB between A and B such that: F1 * AC = F2 * BC (internal division).',
      'Unlike Parallel Forces: Two unequal forces F1 and F2 having opposite directions (assume F1 > F2). 1. Resultant R has magnitude: R = F1 - F2, acting in direction of larger force F1. 2. Point of action C lies on the extension of AB beyond the larger force F1 (external division) such that: F1 * AC = F2 * BC.',
      'Equal and Opposite Parallel Forces: If F1 = F2 in opposite directions, R = 0, but they do NOT maintain equilibrium; they form a Couple of moment M = F1 * AB!',
    ],
    keyFormulas: [
      'Like: R = F1 + F2, F1 * AC = F2 * BC',
      'Unlike: R = |F1 - F2|, F1 * AC = F2 * BC (C on extension)',
      'Vector form: R = F1 + F2 (always)',
      'Position of C: x_C = (F1 * x_A + F2 * x_B) / (F1 + F2)',
    ],
    examTip:
      'The resultant of two parallel forces always lies closer to the larger force. For unlike forces, C is outside the segment AB, beyond the larger force!',
  },
  {
    pageNumber: 11,
    title: 'Equilibrium of a System of Parallel Coplanar Forces',
    content: [
      'A system of parallel coplanar forces is in equilibrium if and only if two conditions are simultaneously satisfied: 1. Sum of algebraic forces equals zero: sum(F) = 0 (Resultant R = 0). 2. Sum of moments about ANY point in the plane equals zero: sum(M_O) = 0.',
      'Applications to Horizontal Beams: A beam resting on supports at C and D subjected to concentrated loads and distributed loads.',
      'Step 1: Replace any uniformly distributed load w (N/m) over length L with an equivalent concentrated load W_eq = w * L acting at its midpoint L/2.',
      'Step 2: Apply sum(Fy) = 0 => R_C + R_D = sum(Loads).',
      'Step 3: Take moments about one support (e.g. sum(M_C) = 0) to directly isolate and solve for R_D, then substitute back for R_C.',
    ],
    keyFormulas: [
      'sum(F) = 0 => Upward forces = Downward forces',
      'sum(M_any point) = 0',
      'Uniform Distributed Load: W_eq = w * L at midpoint',
      'Triangular Distributed Load: W_eq = 0.5 * w_max * L at 2/3 from apex',
    ],
    examTip:
      'Taking moments about a support point immediately cancels its reaction from the moment equation because the lever arm is zero, making calculations swift and error-free!',
  },
  {
    pageNumber: 12,
    title: 'Impending Tilting / Overturning of a Beam',
    content: [
      'When a beam rests on two supports C and D, adding extra weights or moving a load towards one end can cause the beam to be on the verge of tilting (overturning).',
      'Verge of tilting about support C: The beam lifts off the distant support D, which means the reaction at support D becomes zero: R_D = 0!',
      'Verge of tilting about support D: The beam lifts off support C => Reaction R_C = 0!',
      'Maximum load without disturbing equilibrium: Apply the condition that the reaction at the far support is zero (R_far = 0), and solve the moment equation about the tilting fulcrum.',
    ],
    keyFormulas: [
      'Verge of tilting about C => R_D = 0',
      'Verge of tilting about D => R_C = 0',
      'sum(M_tilting fulcrum) = 0 with R_other = 0',
    ],
    examTip:
      'Whenever an exam question asks: "Find the greatest weight that can be suspended from end B without tilting the rod", immediately set the reaction at the other support to ZERO!',
  },
  {
    pageNumber: 13,
    title: 'General Equilibrium of a Rigid Body (The Two Fundamental Conditions)',
    content: [
      'A rigid body under the action of a general coplanar force system is in complete equilibrium if and only if: 1. The resultant force is zero: R = 0 <=> sum(Fx) = 0 and sum(Fy) = 0. 2. The resultant moment about ANY point is zero: sum(M_O) = 0.',
      'Degrees of Freedom in 2D: A rigid body in 2D has 3 degrees of freedom (translation in x, translation in y, and rotation in the plane). Therefore, exactly three independent equations are needed: sum(Fx) = 0, sum(Fy) = 0, sum(M) = 0.',
      'Alternative Sets of Equilibrium Conditions: 1. sum(Fx) = 0, sum(M_A) = 0, sum(M_B) = 0 (where line AB is not perpendicular to x-axis). 2. sum(M_A) = 0, sum(M_B) = 0, sum(M_C) = 0 (where A, B, C are non-collinear points).',
    ],
    keyFormulas: [
      'sum(Fx) = 0 (Rightward forces = Leftward forces)',
      'sum(Fy) = 0 (Upward forces = Downward forces)',
      'sum(M_O) = 0 (Counter-clockwise moments = Clockwise moments)',
    ],
    examTip:
      'Always draw a clear, large Free Body Diagram (FBD) marking all active forces and reactive forces before writing a single equation!',
  },
  {
    pageNumber: 14,
    title: 'Reactions of Supports: Hinges, Smooth & Rough Surfaces',
    content: [
      '1. Smooth Surface / Smooth Floor / Smooth Wall: The reaction is purely normal (perpendicular to the surface at the contact point). Direction is known, magnitude R is unknown. No tangential friction force.',
      '2. Rough Surface: The reaction has two components: Normal reaction R perpendicular to the surface, and friction force Fs along the surface. If on the verge of slipping: Fs = mu_s * R.',
      '3. Smooth Hinge (Pin / Pivot): The magnitude and direction of the hinge reaction are unknown. We represent it by two orthogonal components: X (horizontal) and Y (vertical). Resultant hinge reaction: R_hinge = sqrt(X^2 + Y^2), inclined at angle theta = arctan(Y/X) to the horizontal.',
      '4. Light Inextensible String: Tension T directed along the string towards the point of suspension.',
    ],
    keyFormulas: [
      'Smooth surface: R perpendicular to surface',
      'Hinge reaction: R = sqrt(X^2 + Y^2), tan(theta) = Y / X',
      'Rough surface at limiting state: Fs = mu_s * R',
    ],
    examTip:
      'For a hinge, never guess the inclination angle of the reaction initially; resolve it into X and Y components and determine theta at the end from tan(theta) = Y/X!',
  },
  {
    pageNumber: 15,
    title: 'The Ladder Problem (Uniform Rod Resting on Wall and Floor)',
    content: [
      'Standard Configuration: Uniform ladder AB of length 2L and weight W acting at its midpoint. Leans at angle theta to the horizontal floor. Foot A rests on floor, top B rests on vertical wall.',
      'Case 1: Smooth Vertical Wall and Rough Horizontal Floor: At B: Normal reaction R_B horizontal (to the right). At A: Normal reaction R_A vertical (upwards) and friction Fs horizontal (to the right, opposing slipping outward).',
      'Equilibrium Equations: 1. sum(Fy) = 0 => R_A = W. 2. sum(Fx) = 0 => Fs = R_B. 3. If on the verge of slipping: Fs = mu_s * R_A = mu_s * W => R_B = mu_s * W. 4. sum(M_A) = 0 => W * (L * cos(theta)) - R_B * (2L * sin(theta)) = 0 => W * cos(theta) = 2 * R_B * sin(theta).',
      'Classic Formula for Minimum Angle of Inclination: tan(theta) = 1 / (2 * mu_s) = cot(lambda) / 2!',
    ],
    keyFormulas: [
      'R_A = W',
      'R_B = mu_s * W',
      'tan(theta) = 1 / (2 * mu_s) (when wall is smooth)',
      'If both wall and floor are rough: tan(theta) = (1 - mu_wall * mu_floor) / (2 * mu_floor)',
    ],
    examTip:
      'If the ladder is on the verge of slipping and the vertical wall is smooth, tan(theta) = 1 / (2 * mu_s). This standard formula solves 90% of ladder multiple-choice questions in seconds!',
  },
  {
    pageNumber: 16,
    title: 'Hinged Rods Supported by Strings or Struts',
    content: [
      'A uniform rod AB of weight W is hinged at A to a vertical wall and held in equilibrium in a horizontal or inclined position by a light string connected between B and a point C on the wall above A.',
      'Forces acting on rod: 1. Weight W acting downwards at midpoint G. 2. Tension T in string BC acting at angle alpha to the rod. 3. Hinge reaction components X and Y at A.',
      'Resolving Tension: Along the rod: T * cos(alpha), Perpendicular to the rod: T * sin(alpha).',
      'Solving Strategy: 1. Take sum(M_A) = 0 => W * (L/2 * cos(theta)) = T * sin(alpha) * L => Directly solves for Tension T! 2. Apply sum(Fx) = 0 => X = T * cos(phi). 3. Apply sum(Fy) = 0 => Y = W - T * sin(phi). 4. Calculate total hinge reaction R = sqrt(X^2 + Y^2).',
    ],
    keyFormulas: [
      'sum(M_A) = 0 => W * (L/2) = T * sin(alpha) * L (for horizontal rod)',
      'T = W / (2 * sin(alpha))',
      'X = T * cos(alpha), Y = W - T * sin(alpha) = W/2',
      'R_hinge = sqrt(X^2 + Y^2)',
    ],
    examTip:
      'Notice that for a horizontal rod held by a string at end B, the vertical component of the hinge reaction is always Y = W / 2 regardless of string angle!',
  },
  {
    pageNumber: 17,
    title: 'Theory of Couples (Definition, Moment & Arm of Couple)',
    content: [
      'Definition of a Couple: A system of two equal, parallel, opposite in direction, non-collinear forces acting on a rigid body.',
      'Properties of a Couple: 1. Resultant force R = F1 + F2 = 0 (no translational motion). 2. The moment of a couple is CONSTANT about ANY point in the plane. It is an invariant free vector: M = r_AB x F.',
      'Magnitude of Couple Moment: |M| = F * d, where F is the magnitude of one force and d is the perpendicular distance between their lines of action (arm of the couple).',
      'Sign: Counter-clockwise rotation is positive (+), clockwise is negative (-).',
      'Equilibrium of a Couple: A couple cannot be balanced by a single force; a couple can ONLY be balanced by another couple equal to it in magnitude and opposite in sense: M1 + M2 = 0.',
    ],
    keyFormulas: [
      'Resultant R = 0',
      'M = F * d (d = perpendicular distance between lines of action)',
      'Equilibrium of couples: M1 + M2 = 0 <=> M1 = -M2',
      'Equivalence of couples: M1 = M2',
    ],
    examTip:
      'If an exam question asks: "What single force can balance a couple?", the answer is IMPOSSIBLE! A couple can only be balanced by another couple of equal magnitude and opposite sense!',
  },
  {
    pageNumber: 18,
    title: 'Forces Represented by the Sides of a Closed Polygon Taken in Order',
    content: [
      'Fundamental Theorem: If a system of coplanar forces acting on a rigid body can be represented completely in magnitude, direction, and line of action by the sides of a closed polygon taken in cyclic order, the system is equivalent to a COUPLE.',
      'Ratio of Force to Side Length: The ratio must be constant for all sides: F1 / AB = F2 / BC = F3 / CD = ... = Fn / NA = m (constant ratio in N/cm or N/m).',
      'Moment of the Equivalent Couple: M = +- 2 * m * Area(Polygon), where Area(Polygon) is the geometric area enclosed by the polygon.',
      'Sign Rule: Positive (+) if cyclic order is counter-clockwise, negative (-) if clockwise.',
      'Applications: Triangular frames, rectangles, trapeziums, and regular hexagons.',
    ],
    keyFormulas: [
      'm = Force / Side Length = F / L',
      'M_couple = 2 * m * Area(Polygon)',
      'For a Triangle: M = 2 * m * (0.5 * base * height) = m * base * height',
      'For a Rectangle: M = 2 * m * (Length * Width)',
    ],
    examTip:
      'Remember the factor of 2! Moment of couple = 2 * m * Area. Do not forget to multiply by 2 when applying this theorem!',
  },
  {
    pageNumber: 19,
    title: 'Equivalence and Resultant of Several Coplanar Couples',
    content: [
      'Resultant of Coplanar Couples: The algebraic sum of their moments: M_resultant = sum(M_i) = M1 + M2 + M3 + ...',
      'If M_resultant = 0, the system is in equilibrium under the action of the couples.',
      'If M_resultant != 0, the body rotates under the action of the resultant couple.',
      'Two forces forming a couple with known moment: If two forces F act at points A and B separated by arm d to form a couple of known moment M, then F = M / d.',
      'Adding two forces to a system to produce equilibrium: Calculate the existing net moment M_system; the required balancing forces must form a couple of moment M_balance = -M_system.',
    ],
    keyFormulas: [
      'M_net = M1 + M2 + ... + Mn',
      'Condition of equilibrium: M_net = 0',
      'F_required = |M_net| / d',
    ],
    examTip:
      'Couples are algebraic scalars in 2D: simply add positive and negative moments directly without worrying about coordinates or points of action!',
  },
  {
    pageNumber: 20,
    title: 'Reduction of a Coplanar Force System to a Force and a Couple',
    content: [
      'Any system of coplanar forces acting on a rigid body can be reduced at any chosen base point O to: 1. A single resultant force R passing through O: R = sum(F) = (sum(Fx)) * i + (sum(Fy)) * j. 2. A couple of moment M_O equal to the sum of moments of all forces about O: M_O = sum(r_i x F_i).',
      'Cases of Reduction: 1. If R = 0 and M_O = 0: The system is in COMPLETE EQUILIBRIUM. 2. If R = 0 and M_O != 0: The system reduces to a COUPLE of moment M_O. 3. If R != 0 and M_O = 0: The system reduces to a SINGLE FORCE R passing through O. 4. If R != 0 and M_O != 0: The system reduces to a SINGLE FORCE R whose line of action is at perpendicular distance d = |M_O| / |R| from O.',
      'Equation of the Line of Action of the Resultant: y * R_x - x * R_y + M_O = 0.',
    ],
    keyFormulas: [
      'R = sqrt((sum Fx)^2 + (sum Fy)^2)',
      'M_O = sum(M_O(F_i))',
      'd = |M_O| / |R|',
      'Line of action of R: M_P(R) = 0 for any point P(x,y) on the line',
    ],
    examTip:
      'If both R = 0 and M_O = 0, system is in equilibrium. If R = 0 but M_O != 0, it reduces to a couple. If R != 0, it can ALWAYS be reduced to a single force!',
  },
  {
    pageNumber: 21,
    title: 'Center of Gravity: Concept, Center of Mass & System of Point Masses',
    content: [
      'Concept: The center of gravity (C.G.) of a body is the unique point through which the resultant of the gravitational forces (weights) of all its individual particles passes, regardless of the orientation of the body in space.',
      'Center of Mass vs Center of Gravity: For bodies in a uniform gravitational field (such as near Earth\'s surface), the center of mass coincides exactly with the center of gravity.',
      'System of Point Particles: For masses m1, m2, ..., mn located at coordinates (x1, y1), (x2, y2), ..., (xn, yn):',
      'Coordinates of C.G. (x_G, y_G): x_G = (sum(m_i * x_i)) / (sum(m_i)), y_G = (sum(m_i * y_i)) / (sum(m_i)), z_G = (sum(m_i * z_i)) / (sum(m_i)).',
      'Invariance: The position of the center of gravity relative to the body depends solely on the shape and mass distribution of the body.',
    ],
    keyFormulas: [
      'x_G = (m1*x1 + m2*x2 + ... + mn*xn) / M_total',
      'y_G = (m1*y1 + m2*y2 + ... + mn*yn) / M_total',
      'z_G = (m1*z1 + m2*z2 + ... + mn*zn) / M_total',
      'M_total = sum(m_i)',
    ],
    examTip:
      'Set up a clear origin (0,0) at one corner of the figure to make all particle coordinates positive, preventing negative sign errors in summation!',
  },
  {
    pageNumber: 22,
    title: 'Center of Gravity of Standard Geometric Shapes (Wires & Laminae)',
    content: [
      '1. Uniform Thin Wires (Mass proportional to length): Straight rod: C.G. at midpoint L/2. Triangular wire frame: masses of sides proportional to lengths (a, b, c) concentrated at midpoints of sides. Semicircular wire of radius r: y_G = 2 * r / pi on the axis of symmetry.',
      '2. Uniform Thin Laminae (Mass proportional to area): Rectangle / Parallelogram: C.G. at intersection of diagonals. Triangle: C.G. at intersection of medians (divides each median in ratio 2:1 from vertex, or (x1+x2+x3)/3, (y1+y2+y3)/3). Semicircular lamina of radius r: y_G = 4 * r / (3 * pi) on the axis of symmetry. Circular sector of radius r and central angle 2*alpha: x_G = (2 * r * sin(alpha)) / (3 * alpha).',
      'Symmetry Theorem: If a uniform lamina has an axis of symmetry, its center of gravity MUST lie on that axis.',
    ],
    keyFormulas: [
      'Triangle Lamina: G = ((x1+x2+x3)/3, (y1+y2+y3)/3)',
      'Semicircular Lamina: y_G = 4 * r / (3 * pi)',
      'Semicircular Wire: y_G = 2 * r / pi',
      'Mass ratio for laminae = Area ratio',
      'Mass ratio for wires = Length ratio',
    ],
    examTip:
      'Careful! For a triangular lamina, C.G. is at the intersection of medians ((x1+x2+x3)/3). For a triangular wire frame, you must find side lengths and place masses at side midpoints!',
  },
  {
    pageNumber: 23,
    title: 'The Negative Mass Method (Cutouts & Composite Bodies)',
    content: [
      'When a piece is removed (cut out) from a uniform body, we calculate the center of gravity of the remaining part using the Negative Mass Method.',
      'Principle: Treat the original complete body as mass M1 with C.G. at (x1, y1), and the removed cutout piece as a negative mass (-M2) with C.G. at (x2, y2).',
      'Formula for Remaining Part: x_G = (M1 * x1 - M2 * x2) / (M1 - M2), y_G = (M1 * y1 - M2 * y2) / (M1 - M2).',
      'Example: A square lamina of side 12 cm has a circular hole of radius 3 cm removed. Original mass M1 = Area_square = 144, Cutout mass M2 = Area_circle = pi * 3^2 = 9*pi.',
      'Cavities and Hollowed Bodies: Works identically in 3D for spheres, cylinders, and cones with internal cavities.',
    ],
    keyFormulas: [
      'x_rem = (M_orig * x_orig - M_cut * x_cut) / (M_orig - M_cut)',
      'y_rem = (M_orig * y_orig - M_cut * y_cut) / (M_orig - M_cut)',
      'Area ratio = Mass ratio',
    ],
    examTip:
      'Always remember that the denominator in the negative mass formula is (M_orig - M_cut), representing the mass of the remaining portion!',
  },
  {
    pageNumber: 24,
    title: 'Suspension of a Body & Angle of Inclination of a Side to the Vertical',
    content: [
      'Free Suspension Theorem: When a rigid body is freely suspended from a point of suspension P (pin, nail, or string), it comes to rest in equilibrium when its center of gravity G lies on the vertical line passing through P.',
      'The line PG is called the "Vertical Line" through the body.',
      'Finding the Angle of Inclination (theta) of a side (e.g. side AB) to the vertical: 1. Determine the coordinates of suspension point P(xP, yP) and center of gravity G(xG, yG). 2. Vector PG = (xG - xP) * i + (yG - yP) * j. 3. Slope of the vertical line PG: m = (yG - yP) / (xG - xP). 4. If side AB lies along the x-axis, then tan(theta) = |xG - xP| / |yG - yP| or tan(theta) = cot(angle of slope).',
      'Two Points of Suspension: Suspending a body from two different points and intersecting the vertical lines PG1 and QG2 experimentally locates the center of gravity G!',
    ],
    keyFormulas: [
      'Line of Suspension: PG is vertical',
      'Slope of vertical: m_vert = (yG - yP) / (xG - xP)',
      'tan(theta with horizontal) = |yG - yP| / |xG - xP|',
      'tan(theta with vertical) = |xG - xP| / |yG - yP|',
    ],
    examTip:
      'In suspension problems, draw the vertical line through P and G directly. The tangent of the angle with the vertical side is simply delta_x / delta_y between P and G!',
  },
];
