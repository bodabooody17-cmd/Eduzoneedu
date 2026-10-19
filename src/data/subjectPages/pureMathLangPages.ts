import { SummaryPage } from '../../types';

export const PURE_MATH_LANG_PAGES_24: SummaryPage[] = [
  {
    pageNumber: 1,
    title: 'Differentiation of Trigonometric & Reciprocal Functions',
    content: [
      'Derivatives of primary trigonometric functions: 1. d/dx [sin(x)] = cos(x). If angle is a function u(x): d/dx [sin(u)] = u\'(x) cos(u). 2. d/dx [cos(x)] = -sin(x). 3. d/dx [tan(x)] = sec²(x).',
      'Derivatives of reciprocal trigonometric functions: 1. d/dx [cot(x)] = -csc²(x). 2. d/dx [sec(x)] = sec(x) tan(x). 3. d/dx [csc(x)] = -csc(x) cot(x).',
      'The Co-Sign Rule: Every trigonometric function starting with "Co" (cos, cot, csc) yields a negative sign in its first derivative.',
      'Fundamental Trigonometric Identities for Calculus: sin²x + cos²x = 1, 1 + tan²x = sec²x, 1 + cot²x = csc²x. Double angle formulas: sin(2x) = 2 sin(x) cos(x), cos(2x) = cos²x - sin²x = 2 cos²x - 1 = 1 - 2 sin²x, tan(2x) = (2 tan x) / (1 - tan²x).'
    ],
    keyFormulas: [
      'd/dx [sec x] = sec x tan x',
      'd/dx [cot x] = - csc² x',
      'd/dx [csc x] = - csc x cot x',
      'cos²x = (1 + cos 2x)/2 , sin²x = (1 - cos 2x)/2'
    ],
    examTip: 'Always simplify composite trigonometric expressions with identities before differentiating to save time and prevent algebraic errors!'
  },
  {
    pageNumber: 2,
    title: 'Implicit Differentiation, Parametric Equations & Higher Derivatives',
    content: [
      'Implicit Differentiation: Applied when the relationship between x and y cannot be easily isolated as y = f(x) (e.g. x² + y² = 25 or x³ + y³ = 3xy). Differentiate both sides with respect to x, remembering to multiply each differentiated y-term by dy/dx via the chain rule.',
      'Parametric Differentiation: When x and y are given in terms of a third parameter t (or θ): x = f(t), y = g(t). The first derivative is: dy/dx = (dy/dt) / (dx/dt), provided dx/dt != 0.',
      'Second Derivative in Parametric Form (Crucial Exam Concept): d²y/dx² = d/dx (dy/dx) = [ d/dt (dy/dx) ] × (dt/dx) = [ d/dt (dy/dx) ] / (dx/dt). Never forget the final multiplication by (dt/dx)!',
      'Cyclic Patterns of Higher Derivatives: Trigonometric derivatives repeat periodically every 4 derivatives: d⁴/dx⁴ [sin x] = sin x. Hence, the (4n)-th derivative yields the original function.'
    ],
    keyFormulas: [
      'dy/dx = (dy/dt) / (dx/dt)',
      'd²y/dx² = [ d/dt (dy/dx) ] / (dx/dt)',
      'x² + y² = r² => dy/dx = - x / y'
    ],
    examTip: 'Over 60% of students forget to divide by (dx/dt) when finding d²y/dx² in parametric form. Double check this step every single time.'
  },
  {
    pageNumber: 3,
    title: 'Tangents, Normals & Geometric Applications of Derivatives',
    content: [
      'Slope of the Tangent (m): The slope of the tangent line to the curve y = f(x) at point P(x1, y1) is the first derivative evaluated at that point: m = dy/dx |_(x1, y1).',
      'Equation of the Tangent Line: (y - y1) = m (x - x1).',
      'Slope and Equation of the Normal Line: The slope of the normal (perpendicular to tangent) is m_normal = - 1 / m (for m != 0). Equation: (y - y1) = (- 1 / m) (x - x1).',
      'Special Geometric Cases: 1. Horizontal tangent (parallel to x-axis): dy/dx = 0; equation is y = y1. 2. Vertical tangent (parallel to y-axis): dy/dx is undefined (denominator = 0); equation is x = x1. 3. Tangent inclined at angle θ with positive x-axis: m = tan(θ). 4. Parallel tangents have equal slopes: m1 = m2. Perpendicular lines: m1 × m2 = -1.'
    ],
    keyFormulas: [
      'm = dy/dx |_(x1, y1)',
      'Tangent: y - y1 = m (x - x1)',
      'Normal: y - y1 = (-1/m) (x - x1)',
      'Line ax + by + c = 0 => Slope = - a / b'
    ],
    examTip: 'If the problem states: "The tangent is perpendicular to line 3x - 4y + 5 = 0", the line slope is 3/4, so the tangent slope is -4/3.'
  },
  {
    pageNumber: 4,
    title: 'Related Time Rates & Structured Problem Solving',
    content: [
      'Concept of Related Rates: Rates of change of related variables with respect to time (d/dt) connected by geometric or physical relationships.',
      'Step-by-step Standard Strategy: 1. Sketch a neat diagram and identify variables (changing quantities like x, y, θ, V) and constants (unchanging lengths). 2. Identify given rates (e.g. dx/dt) and specify the requested rate (e.g. dy/dt or dV/dt). 3. Formulate the governing mathematical relation (Pythagorean theorem, triangle similarity, law of cosines, volume or area formulas). 4. Differentiate both sides with respect to time t using chain rule. 5. Substitute the instantaneous numerical values at the exact moment specified (NEVER substitute before differentiating!).',
      'Sign Conventions: Rate > 0 when the quantity is increasing (expansion, moving away). Rate < 0 when the quantity is decreasing (shrinking, leaking, melting, approaching).'
    ],
    keyFormulas: [
      'Pythagoras: x² + y² = L² => x (dx/dt) + y (dy/dt) = 0',
      'Sphere Volume: V = (4/3) π r³ => dV/dt = 4 π r² (dr/dt)',
      'Circle Area: A = π r² => dA/dt = 2 π r (dr/dt)'
    ],
    examTip: 'A sliding ladder problem: if the bottom slides away at dx/dt = 2 m/s, the top moves down, so dy/dt must calculate as negative.'
  },
  {
    pageNumber: 5,
    title: 'Monotonicity, Critical Points & First Derivative Test',
    content: [
      'Critical Points: Points (c, f(c)) in the domain of f where f\'(c) = 0 (horizontal tangent) or f\'(c) does not exist (corners, cusps, vertical tangents). Note: c MUST belong to the domain D_f.',
      'Intervals of Increase and Decrease: 1. f is strictly increasing on interval I if f\'(x) > 0 for all x in I. 2. f is strictly decreasing on interval I if f\'(x) < 0 for all x in I. 3. f is constant if f\'(x) = 0.',
      'The First Derivative Test for Local Extrema: Examine the sign of f\'(x) across critical number x = c: - Positive to negative (+ to -): Local maximum at x = c with value f(c). - Negative to positive (- to +): Local minimum at x = c with value f(c). - No sign change: Neither local max nor local min (stationary point of inflection).'
    ],
    keyFormulas: [
      'Critical Point: f\'(x) = 0 or f\'(x) is undefined (x in Domain)',
      'f\'(x) > 0 => Strictly Increasing (↗)',
      'f\'(x) < 0 => Strictly Decreasing (↘)'
    ],
    examTip: 'Always state the domain first! If f(x) = 1/x, x = 0 is NOT a critical point because 0 is not in the domain.'
  },
  {
    pageNumber: 6,
    title: 'Concavity, Points of Inflection & Second Derivative Test',
    content: [
      'Concavity and Second Derivative f\'\'(x): 1. Concave upward (∪): The curve lies above all its tangent lines on interval I if f\'\'(x) > 0. 2. Concave downward (∩): The curve lies below all its tangent lines on interval I if f\'\'(x) < 0.',
      'Point of Inflection: A point P(c, f(c)) on the curve where the concavity changes from upward to downward or vice versa, and a tangent exists at P. Necessary conditions: 1. P is in the domain. 2. f\'\'(c) = 0 or f\'\'(c) does not exist. 3. f\'\'(x) changes sign across x = c.',
      'Second Derivative Test for Local Extrema: Let f\'(c) = 0: - If f\'\'(c) < 0: f has a local maximum at x = c. - If f\'\'(c) > 0: f has a local minimum at x = c. - If f\'\'(c) = 0: The test is inconclusive; use the First Derivative Test.'
    ],
    keyFormulas: [
      'f\'\'(x) > 0 => Concave Upward (∪)',
      'f\'\'(x) < 0 => Concave Downward (∩)',
      'Inflection: f\'\'(c) = 0 and concavity changes sign'
    ],
    examTip: 'f\'\'(c) = 0 does not automatically guarantee an inflection point. For example, y = x⁴ has f\'\'(0) = 0, but is concave up everywhere, so (0,0) is not an inflection point!'
  },
  {
    pageNumber: 7,
    title: 'Absolute Extrema & Applied Optimization Problems',
    content: [
      'Extreme Value Theorem (Weierstrass): A continuous function on a closed bounded interval [a, b] attains both an absolute maximum and an absolute minimum.',
      'Algorithm to find Absolute Extrema on [a, b]: 1. Find all critical numbers c in the open interval (a, b) where f\'(c) = 0 or f\' is undefined. 2. Evaluate f(c) for all such critical numbers. 3. Evaluate the boundary values f(a) and f(b). 4. The greatest of these values is the absolute maximum; the least is the absolute minimum.',
      'Applied Optimization Problems: 1. Define the objective function (quantity to maximize/minimize: area, volume, profit, cost). 2. Use constraints to express the objective function in terms of a single independent variable. 3. Find the critical points by setting the derivative to zero and verify with the second derivative.'
    ],
    keyFormulas: [
      'Absolute Max = max { f(a), f(b), f(critical points) }',
      'Absolute Min = min { f(a), f(b), f(critical points) }',
      'Rectangle of max area inside circle radius R: Square with side = R sqrt(2)'
    ],
    examTip: 'In optimization, check the physical boundaries (endpoints). If you get an open interval, use the first or second derivative to prove the maximum or minimum.'
  },
  {
    pageNumber: 8,
    title: 'Euler\'s Number (e) & Limits of Exponential & Logarithmic Functions',
    content: [
      'Euler\'s Number (e ≈ 2.71828...): Defined as the base of natural logarithms by the limit: lim_(x->∞) (1 + 1/x)^x = e, or lim_(x->0) (1 + x)^(1/x) = e.',
      'Standard Exponential and Logarithmic Limits: 1. lim_(x->0) [ (1 + ax)^(b/x) ] = e^(ab). 2. lim_(x->∞) [ (1 + a/x)^(bx) ] = e^(ab). 3. lim_(x->0) [ (e^x - 1) / x ] = 1. 4. lim_(x->0) [ (a^x - 1) / x ] = ln(a). 5. lim_(x->0) [ ln(1 + x) / x ] = 1.',
      'Properties of Natural Logarithms (ln x): ln(xy) = ln x + ln y, ln(x/y) = ln x - ln y, ln(x^n) = n ln x, ln(e) = 1, ln(1) = 0, e^(ln x) = x.'
    ],
    keyFormulas: [
      'lim_(x->0) (1 + ax)^(b/x) = e^(ab)',
      'lim_(x->0) (e^x - 1)/x = 1',
      'lim_(x->0) (a^x - 1)/x = ln(a)',
      'lim_(x->0) [ln(1 + x)] / x = 1'
    ],
    examTip: 'If the base in the limit is a constant other than e (e.g. (3^x - 1)/x as x->0), the result is ln(3), not 1!'
  },
  {
    pageNumber: 9,
    title: 'Calculus of Exponential & Logarithmic Functions',
    content: [
      'Derivatives: 1. d/dx [ e^x ] = e^x, and d/dx [ e^u ] = u\' e^u. 2. d/dx [ a^x ] = a^x ln(a), and d/dx [ a^u ] = u\' a^u ln(a). 3. d/dx [ ln |x| ] = 1/x, and d/dx [ ln |u| ] = u\' / u (derivative divided by function). 4. d/dx [ log_a |x| ] = 1 / (x ln a).',
      'Integrals: 1. ∫ e^(ax + b) dx = (1/a) e^(ax + b) + C. 2. ∫ u\'(x) e^u(x) dx = e^u(x) + C. 3. ∫ a^x dx = (a^x / ln a) + C. 4. ∫ [ u\'(x) / u(x) ] dx = ln |u(x)| + C (When the numerator is the exact derivative of the denominator, the integral is the natural logarithm of the denominator!).',
      'Logarithmic Differentiation: Used for functions with variable base and variable exponent: y = [f(x)]^[g(x)]. Take natural log of both sides: ln y = g(x) ln[f(x)], then differentiate implicitly.'
    ],
    keyFormulas: [
      'd/dx [e^u] = u\' e^u',
      'd/dx [ln u] = u\' / u',
      '∫ [u\' / u] dx = ln |u| + C',
      '∫ e^(ax) dx = (1/a) e^(ax) + C'
    ],
    examTip: 'For y = x^x, never use power rule or exponential rule directly! Take ln of both sides: ln y = x ln x => y\'/y = ln x + 1 => y\' = x^x (1 + ln x).'
  },
  {
    pageNumber: 10,
    title: 'Advanced Integration Techniques: Substitution & By Parts',
    content: [
      'Integration by Substitution: Transforms an integrand into standard form by letting u = g(x), so du = g\'(x) dx. Standard rule: ∫ [g(x)]^n g\'(x) dx = [g(x)]^(n+1) / (n+1) + C (for n != -1).',
      'Integration by Parts: Used for products of unrelated functions: ∫ u dv = u v - ∫ v du.',
      'The LIATE Rule for choosing u: Select u in order of priority: L (Logarithmic: ln x) -> I (Inverse trigonometric) -> A (Algebraic: polynomials) -> T (Trigonometric: sin, cos) -> E (Exponential: e^x). dv is the remainder.',
      'Example: ∫ ln(x) dx: Let u = ln(x) => du = (1/x) dx; dv = dx => v = x. Then ∫ ln(x) dx = x ln(x) - ∫ x (1/x) dx = x ln(x) - x + C.'
    ],
    keyFormulas: [
      'Formula: ∫ u dv = u v - ∫ v du',
      '∫ [f(x)]^n f\'(x) dx = [f(x)]^(n+1) / (n+1) + C',
      '∫ ln(x) dx = x ln(x) - x + C'
    ],
    examTip: 'If integrating a polynomial times an exponential or sine/cosine, repeated integration by parts or the Tabular Method gives the solution in seconds.'
  },
  {
    pageNumber: 11,
    title: 'Definite Integrals, Properties & Symmetry (Even / Odd Functions)',
    content: [
      'Fundamental Theorem of Calculus: ∫_a^b f(x) dx = [ F(x) ]_a^b = F(b) - F(a), where F\'(x) = f(x).',
      'Fundamental Properties: 1. ∫_a^a f(x) dx = 0. 2. ∫_a^b f(x) dx = - ∫_b^a f(x) dx. 3. Additive property: ∫_a^b f(x) dx = ∫_a^c f(x) dx + ∫_c^b f(x) dx.',
      'Symmetry on [-a, a]: 1. If f is an ODD function (f(-x) = -f(x)) on [-a, a]: ∫_(-a)^a f(x) dx = 0 immediately! (e.g. x³, sin x, tan x). 2. If f is an EVEN function (f(-x) = f(x)) on [-a, a]: ∫_(-a)^a f(x) dx = 2 ∫_0^a f(x) dx (e.g. x², cos x).'
    ],
    keyFormulas: [
      'Odd function on [-a, a]: ∫_(-a)^a f(x) dx = 0',
      'Even function on [-a, a]: ∫_(-a)^a f(x) dx = 2 ∫_0^a f(x) dx',
      'Partition: ∫_a^b = ∫_a^c + ∫_c^b'
    ],
    examTip: 'Look at the limits of integration! If they are symmetric like [-π/2, π/2] or [-2, 2], check whether the integrand is odd. If so, write 0 instantly!'
  },
  {
    pageNumber: 12,
    title: 'Plane Areas & Volumes of Revolution in 3D',
    content: [
      'Plane Area between Curves: 1. Area between y = f(x) and x-axis on [a, b]: Area = ∫_a^b |f(x)| dx. 2. Area enclosed between two curves y = f(x) and y = g(x): Area = ∫_a^b |f(x) - g(x)| dx, where limits a and b are points of intersection found by solving f(x) = g(x).',
      'Volumes of Revolution (Full rotation 2π): 1. Revolution around the x-axis: V = π ∫_a^b [y]² dx = π ∫_a^b [f(x)]² dx. For region between two curves: V = π ∫_a^b [ (y_top)² - (y_bottom)² ] dx. 2. Revolution around the y-axis: V = π ∫_c^d [x]² dy = π ∫_c^d [g(y)]² dy.',
      'Critical Warning: In volume between two curves, V = π ∫ (y1² - y2²) dx, NOT π ∫ (y1 - y2)² dx! Always square first, then subtract.'
    ],
    keyFormulas: [
      'Area = ∫_a^b |y_upper - y_lower| dx',
      'Volume about x-axis: V = π ∫_a^b (y)² dx',
      'Volume about y-axis: V = π ∫_c^d (x)² dy'
    ],
    examTip: 'Do not forget the π factor in volume calculations! Missing π is the most common student error in calculus exams.'
  },
  {
    pageNumber: 13,
    title: 'Fundamental Counting Principle, Permutations & Combinations',
    content: [
      'Counting Principle: If operation A can be performed in m ways and operation B in n ways: - Both A AND B can be performed in (m × n) ways. - Either A OR B can be performed in (m + n) ways.',
      'Permutations (nPr): Ordered arrangements of r items taken from n distinct items (order matters, no repetition): nPr = n! / (n - r)! = n(n-1)(n-2)... (r factors). Circular arrangements of n items: (n - 1)!.',
      'Combinations (nCr): Unordered selections of r items from n distinct items (order does not matter): nCr = nPr / r! = n! / [ r! (n - r)! ].',
      'Key Combination Properties: 1. Complementary: nCr = nC(n - r). 2. Equality: nCx = nCy => either x = y or x + y = n. 3. Ratio law: nCr / nC(r - 1) = (n - r + 1) / r. 4. Pascal\'s Addition Law: nCr + nC(r - 1) = (n + 1)Cr.'
    ],
    keyFormulas: [
      'nPr = n! / (n - r)!',
      'nCr = n! / [ r! (n - r)! ]',
      'Ratio: nCr / nC(r - 1) = (n - r + 1) / r',
      'Sum: nCr + nC(r - 1) = (n + 1)Cr'
    ],
    examTip: 'Keywords: "Arrangement, rank, secret code, queue" => Permutations (nPr). "Committee, team, selection, group" => Combinations (nCr).'
  },
  {
    pageNumber: 14,
    title: 'The Binomial Theorem, General Term & Middle Terms',
    content: [
      'Binomial Expansion for Positive Integer Exponent n: (x + a)^n = nC0 x^n + nC1 x^(n-1) a¹ + nC2 x^(n-2) a² + ... + nCn a^n. Total number of terms = n + 1.',
      'The General Term T_(r + 1): T_(r + 1) = nCr × (Second Term)^r × (First Term)^(n - r). This is the key tool to find specific terms, terms independent of x, or coefficients of x^k.',
      'Middle Term(s): 1. If n is even: Exactly ONE middle term, rank = (n/2) + 1. 2. If n is odd: Exactly TWO middle terms, ranks = (n + 1)/2 and (n + 3)/2.',
      'Ratio of Consecutive Terms: T_(r + 1) / T_r = [ (n - r + 1) / r ] × [ Second Term / First Term ].',
      'Sum of Coefficients: Set all variables equal to 1 in the original binomial expression.'
    ],
    keyFormulas: [
      'General Term: T_(r + 1) = nCr (2nd)^r (1st)^(n - r)',
      'Ratio: T_(r+1) / T_r = [ (n - r + 1) / r ] × (2nd / 1st)',
      'n is even => Middle term rank = (n/2) + 1'
    ],
    examTip: 'To find the term independent of x: write T_(r+1), combine all powers of x into x^(expression in r), equate that exponent to 0, solve for r, then calculate T_(r+1).'
  },
  {
    pageNumber: 15,
    title: 'Complex Numbers: Algebraic & Trigonometric (Polar) Forms',
    content: [
      'Complex Number z = x + y i: Real part Re(z) = x, Imaginary part Im(z) = y, where i² = -1, i³ = -i, i⁴ = 1.',
      'Modulus and Principal Amplitude: 1. Modulus r = |z| = sqrt(x² + y²). 2. Principal Argument θ (Amplitude): The angle made by the vector with the positive x-axis, strictly in the range: -π < θ <= π (-180° < θ <= 180°).',
      'Determining Principal Argument θ: - Quadrant I (+, +): θ = arctan|y/x|. - Quadrant II (-, +): θ = π - arctan|y/x|. - Quadrant III (-, -): θ = -π + arctan|y/x|. - Quadrant IV (+, -): θ = - arctan|y/x|.',
      'Standard Trigonometric Form: z = r [ cos(θ) + i sin(θ) ]. Must have a positive sign, r > 0, cos as real part, and sin with the imaginary unit i.'
    ],
    keyFormulas: [
      'r = sqrt(x² + y²)',
      'Principal Argument: -π < θ <= π',
      'Trigonometric Form: z = r ( cos θ + i sin θ )',
      'Conjugate: z* = r ( cos(-θ) + i sin(-θ) )'
    ],
    examTip: 'If given non-standard form like z = r(sin θ + i cos θ), use co-angle transformations: sin θ = cos(90 - θ) and cos θ = sin(90 - θ).'
  },
  {
    pageNumber: 16,
    title: 'Exponential Form (Euler\'s Formula) & De Moivre\'s Theorem',
    content: [
      'Euler\'s Formula: e^(i θ) = cos(θ) + i sin(θ). Hence, the Exponential Form of a complex number is: z = r e^(i θ), where r is the modulus and θ is the principal argument in radians.',
      'Multiplication and Division: - Multiplication: Multiply moduli, add arguments: z1 z2 = r1 r2 e^(i (θ1 + θ2)). - Division: Divide moduli, subtract arguments: z1 / z2 = (r1 / r2) e^(i (θ1 - θ2)).',
      'De Moivre\'s Theorem: For any integer n: [ r ( cos θ + i sin θ ) ]^n = r^n [ cos(n θ) + i sin(n θ) ].',
      'Roots of Complex Numbers (n-th roots): z^(1/k) = r^(1/k) [ cos( (θ + 2mπ)/k ) + i sin( (θ + 2mπ)/k ) ], where m = 0, 1, 2, ... (k - 1).'
    ],
    keyFormulas: [
      'Euler Form: z = r e^(i θ)',
      'De Moivre: z^n = r^n ( cos nθ + i sin nθ )',
      'Roots: Argument = (θ + 2 m π) / k for m = 0, 1, ... k-1'
    ],
    examTip: 'When finding n-th roots, ensure the resulting arguments fall into (-π, π]. If an argument exceeds π, subtract 2π.'
  },
  {
    pageNumber: 17,
    title: 'Cube Roots of Unity (Omega ω) & Algebraic Identities',
    content: [
      'Roots of z³ = 1: The three cube roots of unity are: 1, -1/2 + (sqrt(3)/2)i, and -1/2 - (sqrt(3)/2)i. Denoted by 1, ω, and ω².',
      'Fundamental Properties of Omega: 1. Product law: ω³ = 1, ω^(3n) = 1, ω⁴ = ω, ω⁵ = ω². Reciprocals: 1/ω = ω², 1/ω² = ω. 2. Sum law: 1 + ω + ω² = 0. Derived identities: 1 + ω = - ω², 1 + ω² = - ω, ω + ω² = - 1. 3. Difference of imaginary roots: (ω - ω²) = ± sqrt(3) i, and (ω - ω²)² = - 3.',
      'Simplifying Fractional Expressions: To simplify expressions with matching coefficients like (a + b ω) / (a ω² + b), multiply the free constant in the numerator by ω³ (= 1) and factor out ω.'
    ],
    keyFormulas: [
      '1 + ω + ω² = 0',
      'ω³ = 1 , 1/ω = ω²',
      'ω - ω² = ± sqrt(3) i',
      '(ω - ω²)² = - 3'
    ],
    examTip: 'In fraction simplification involving ω: multiply the constant without omega by ω³ and factor out ω to cancel numerator with denominator.'
  },
  {
    pageNumber: 18,
    title: 'Determinants: Advanced Properties & Triangular Form',
    content: [
      'Evaluation: 2×2 determinant |a b ; c d| = ad - bc. 3×3 evaluated by cofactor expansion along any row or column.',
      'Essential Properties without Expansion: 1. |A| = |A^T| (transposing rows into columns does not change determinant value). 2. If two rows (or columns) are identical or proportional, |A| = 0. 3. If an entire row or column consists of zeros, |A| = 0. 4. Swapping two rows changes the sign of the determinant. 5. A common factor from any single row or column can be factored out.',
      'Upper/Lower Triangular Form: If all entries above or below the main diagonal are zeros, the determinant is simply the product of the main diagonal entries: |a 0 0 ; d b 0 ; g h c| = a × b × c.'
    ],
    keyFormulas: [
      'Triangular form: |A| = Product of diagonal entries',
      'Two identical rows => |A| = 0',
      'For 3×3 matrix: |k A| = k³ |A|'
    ],
    examTip: 'Remember that for an n×n matrix, |k A| = k^n |A|. For 3×3: |2A| = 8|A|.'
  },
  {
    pageNumber: 19,
    title: 'Matrices, Multiplicative Inverse & Systems of Linear Equations',
    content: [
      'Adjugate Matrix and Inverse: 1. Calculate determinant |A|. A has an inverse if and only if |A| != 0 (non-singular). 2. Form matrix of cofactors, then transpose it to get adj(A). 3. Multiplicative Inverse: A⁻¹ = (1 / |A|) × adj(A).',
      'Rank of a Matrix (Rank(A)): The order of the largest non-zero sub-determinant in A. For an m×n matrix, rank(A) <= min(m, n). An n×n square matrix has rank n iff |A| != 0.',
      'Rouché-Capelli Theorem for Linear Systems (AX = B): 1. Unique solution: rank(A) = rank([A|B]) = n (number of unknowns). 2. Infinitely many solutions: rank(A) = rank([A|B]) < n. 3. No solution (inconsistent): rank(A) != rank([A|B]).',
      'Homogeneous Systems (AX = 0): Always consistent with trivial solution (0,0,0). Has non-trivial solutions if and only if |A| = 0.'
    ],
    keyFormulas: [
      'A⁻¹ = (1 / |A|) adj(A)',
      'A A⁻¹ = I',
      'rank(A) = rank([A|B]) = n => Unique solution'
    ],
    examTip: 'For homogeneous systems AX = 0 to have non-trivial (non-zero) solutions, set the determinant |A| = 0 and solve for the unknown parameter.'
  },
  {
    pageNumber: 20,
    title: '3D Coordinate System, Distance, Midpoints & Equation of Sphere',
    content: [
      '3D Rectangular Coordinates: Point P(x, y, z). Distances from coordinate planes: to xy-plane = |z|, to xz-plane = |y|, to yz-plane = |x|. Distance to x-axis = sqrt(y² + z²), to y-axis = sqrt(x² + z²), to z-axis = sqrt(x² + y²).',
      'Distance & Midpoint: Distance d = sqrt[ (x2-x1)² + (y2-y1)² + (z2-z1)² ]. Midpoint M = [ (x1+x2)/2, (y1+y2)/2, (z1+z2)/2 ].',
      'Equation of a Sphere: 1. Standard Form (Center (d, e, k), radius r): (x - d)² + (y - e)² + (z - k)² = r². 2. General Form: x² + y² + z² + 2Lx + 2Ky + 2Nz + D = 0. Center = (-L, -K, -N) and Radius r = sqrt(L² + K² + N² - D), where L² + K² + N² - D > 0.'
    ],
    keyFormulas: [
      'Distance to x-axis = sqrt(y² + z²)',
      'Standard Sphere: (x - d)² + (y - e)² + (z - k)² = r²',
      'Center = (-coeff x / 2, -coeff y / 2, -coeff z / 2)',
      'r = sqrt(L² + K² + N² - D)'
    ],
    examTip: 'Before calculating center and radius from general sphere form, ensure coefficients of x², y², z² are all equal to 1!'
  },
  {
    pageNumber: 21,
    title: 'Vectors in 3D: Dot Product, Cross Product & Direction Cosines',
    content: [
      'Magnitude & Unit Vector: Vector A = (Ax, Ay, Az). ||A|| = sqrt(Ax² + Ay² + Az²). Unit vector u_A = A / ||A|| = (cos θx, cos θy, cos θz), satisfying: cos²(θx) + cos²(θy) + cos²(θz) = 1.',
      'Scalar (Dot) Product: A . B = ||A|| ||B|| cos(θ) = Ax Bx + Ay By + Az Bz. Angle: cos(θ) = (A . B) / (||A|| ||B||). Perpendicularity condition: A ⊥ B <=> A . B = 0.',
      'Projections: - Algebraic component of A along B = (A . B) / ||B||. - Vector component of A along B = [ (A . B) / ||B||² ] B.',
      'Vector (Cross) Product: A × B = determinant [i j k ; Ax Ay Az ; Bx By Bz]. Magnitude ||A × B|| = ||A|| ||B|| sin(θ) = Area of parallelogram. Parallel condition: A // B <=> A × B = 0 <=> Ax/Bx = Ay/By = Az/Bz.'
    ],
    keyFormulas: [
      'cos² θx + cos² θy + cos² θz = 1',
      'A . B = Ax Bx + Ay By + Az Bz',
      'A ⊥ B <=> A . B = 0',
      'Parallelogram Area = ||A × B||'
    ],
    examTip: 'cos² θx + cos² θy + cos² θz = 1 is an annual exam favorite! If given two direction angles, use this to find the third.'
  },
  {
    pageNumber: 22,
    title: 'Equations of a Straight Line in 3D Space',
    content: [
      'Definition: A line in space is uniquely defined by a point on it P(x1, y1, z1) and a direction vector d = (a, b, c).',
      'Forms of Line Equation: 1. Vector Form: r = P + t d => (x, y, z) = (x1, y1, z1) + t (a, b, c). 2. Parametric Form: x = x1 + at, y = y1 + bt, z = z1 + ct. 3. Cartesian (Symmetric) Form: (x - x1) / a = (y - y1) / b = (z - z1) / c.',
      'Angle between Two Lines: cos(θ) = |d1 . d2| / (||d1|| ||d2||). Perpendicular: d1 . d2 = 0. Parallel: d1 = k d2.',
      'Distance from Point N to Line: d_perp = ||PN × d|| / ||d||, where P is any known point on the line.'
    ],
    keyFormulas: [
      'Vector: r = P + t d',
      'Cartesian: (x - x1)/a = (y - y1)/b = (z - z1)/c',
      'cos θ = |d1 . d2| / (||d1|| ||d2||)',
      'Perpendicular distance: ||PN × d|| / ||d||'
    ],
    examTip: 'Beware of disguised Cartesian forms! For (3x - 6)/9 = (y + 1)/2, divide top and bottom of the first fraction by 3 to get (x - 2)/3, so direction component a = 3, not 9!'
  },
  {
    pageNumber: 23,
    title: 'Equations of a Plane in 3D Space & Relative Positions',
    content: [
      'Definition: A plane is defined by a point on it P(x1, y1, z1) and a normal vector n = (a, b, c).',
      'Forms of Plane Equation: 1. Vector Form: n . r = n . P. 2. Standard Form: a(x - x1) + b(y - y1) + c(z - z1) = 0. 3. General Cartesian Form: ax + by + cz + d = 0, where d = - n . P. 4. Intercept Form: x/a + y/b + z/c = 1.',
      'Angle between Two Planes: cos(θ) = |n1 . n2| / (||n1|| ||n2||). Planes perpendicular: n1 . n2 = 0. Planes parallel: n1 // n2.',
      'Distance from Point P(x1, y1, z1) to Plane ax + by + cz + d = 0: L = |a x1 + b y1 + c z1 + d| / sqrt(a² + b² + c²).'
    ],
    keyFormulas: [
      'Plane: ax + by + cz + d = 0',
      'Normal vector n = (a, b, c)',
      'Distance from point to plane: L = |ax1 + by1 + cz1 + d| / sqrt(a² + b² + c²)',
      'Angle between line (d) and plane (n): sin θ = |d . n| / (||d|| ||n||)'
    ],
    examTip: 'The angle between a line (dir d) and a plane (normal n) uses sine: sin(θ) = |d . n| / (||d|| ||n||), because the normal is perpendicular to the plane!'
  },
  {
    pageNumber: 24,
    title: 'The Master Cheat Sheet: Pure Mathematics 2026',
    content: [
      'Calculus Key Takeaways: 1- Trig derivatives: co-functions are negative. 2- Definite integrals: odd functions on [-a, a] equal 0 immediately. 3- Volumes of revolution: remember π and square before subtracting: π ∫ (y1² - y2²) dx. 4- Exponential limits: lim (1 + a/x)^(bx) = e^(ab).',
      'Algebra & Geometry Key Takeaways: 1- Combinations vs Permutations: Order matters = nPr, order irrelevant = nCr. 2- Complex Numbers: 1 + ω + ω² = 0, ω³ = 1, (ω - ω²) = ± sqrt(3)i. Euler: z = r e^(iθ). 3- Matrices: System has unique solution iff rank(A) = rank([A|B]) = n. 4- Geometry: cos² θx + cos² θy + cos² θz = 1. Distance to plane = |ax + by + cz + d| / sqrt(a² + b² + c²).',
      'Exam Strategy: Maintain pacing, sketch diagrams for rate and geometry problems, double-check signs, and review algebraic simplifications.'
    ],
    keyFormulas: [
      'lim (1 + a/x)^(bx) = e^(ab)',
      'ω³ = 1 , 1 + ω + ω² = 0',
      'V = π ∫ y² dx',
      'L = |ax + by + cz + d| / sqrt(a² + b² + c²)'
    ],
    examTip: 'Read each question attentively, circle key constraints, write clear steps, and write final answers inside boxes for maximum clarity.'
  }
];
