import sympy as sp

# Define the symbols
x, y, ax, bx, px, ay, by, py = sp.symbols('x y ax bx px ay by py')

# Define the equations
equation1 = sp.Eq(ax * x + bx * y, px)
equation2 = sp.Eq(ay * x + by * y, py)

# Solve the first equation for y
solution_for_y = sp.solve(equation1, y)
print(solution_for_y)

# Substitute the solution for y into the second equation
equation2_substituted = equation2.subs(y, solution_for_y[0])

# Solve the substituted equation for x
solution_for_x = sp.solve(equation2_substituted, x)

# Now, substitute the solution for x back into the expression for y
final_solution_for_y = solution_for_y[0].subs(x, solution_for_x[0])

# Display the results
print("Solution for y in terms of x and other parameters:")
print("y =", final_solution_for_y)