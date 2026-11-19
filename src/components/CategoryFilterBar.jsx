function CategoryFilterBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`btn btn-sm ${
            selectedCategory === cat ? "btn-dark" : "btn-outline-secondary"
          }`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilterBar;
