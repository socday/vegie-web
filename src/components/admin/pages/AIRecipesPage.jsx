import React, { useState } from 'react'
import { generateRecipe, deleteRecipe, getMyRecipes } from '../../../router/adminApi'

export default function AIRecipesPage() {
  const [recipes, setRecipes] = useState([])
  const [oldRecipes, setOldRecipes] = useState([])
  const [activeSection, setActiveSection] = useState('new') // 'new' or 'old'
  const [formData, setFormData] = useState({
    ingredients: '',
    dietaryPreferences: '',
    cookingSkillLevel: 'intermediate'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingOldRecipes, setIsLoadingOldRecipes] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState(null)

  // No need to load recipes on mount for new recipes section

  const loadOldRecipes = async () => {
    try {
      setIsLoadingOldRecipes(true)
      const response = await getMyRecipes()
      if (response.isSuccess && response.data?.items) {
        // For old recipes, we don't need input data, just the recipe output
        const transformedOldRecipes = response.data.items.map(recipe => ({
          id: recipe.id,
          output: recipe,
          createdAt: new Date(recipe.createdAt)
        }))
        setOldRecipes(transformedOldRecipes)
      }
    } catch (error) {
      console.error('Failed to load old recipes:', error)
    } finally {
      setIsLoadingOldRecipes(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.ingredients.trim() || isLoading) return

    setIsLoading(true)

    try {
      // Parse ingredients from user input
      const ingredients = formData.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing)
      
      // Create date in UTC+7 timezone
      const now = new Date()
      const utcPlus7 = new Date(now.getTime() + (7 * 60 * 60 * 1000))
      
      const response = await generateRecipe({
        ingredients,
        date: utcPlus7.toISOString(),
        dietaryPreferences: formData.dietaryPreferences || "none",
        cookingSkillLevel: formData.cookingSkillLevel
      })

      const newRecipe = {
        id: Date.now(),
        input: {
          ingredients: formData.ingredients,
          dietaryPreferences: formData.dietaryPreferences || 'Không có',
          cookingSkillLevel: formData.cookingSkillLevel
        },
        output: response.data,
        createdAt: new Date()
      }

      setRecipes(prev => [newRecipe, ...prev])
      
      // Reset form
      setFormData({
        ingredients: '',
        dietaryPreferences: '',
        cookingSkillLevel: 'intermediate'
      })
    } catch (error) {
      console.error('AI Recipe error:', error)
      alert('Có lỗi xảy ra khi tạo công thức. Vui lòng thử lại sau!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công thức này không?')) return

    try {
      const recipe = recipes.find(r => r.id === recipeId)
      if (recipe?.output?.id) {
        await deleteRecipe(recipe.output.id)
      }
      
      setRecipes(prev => prev.filter(r => r.id !== recipeId))
    } catch (error) {
      console.error('Delete recipe error:', error)
      alert('Có lỗi xảy ra khi xóa công thức. Vui lòng thử lại sau!')
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSectionToggle = (section) => {
    setActiveSection(section)
    if (section === 'old' && oldRecipes.length === 0) {
      loadOldRecipes()
    }
  }

  const confirmDelete = async () => {
    if (!recipeToDelete) return

    try {
      await deleteRecipe(recipeToDelete)
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeToDelete))
      setOldRecipes(prev => prev.filter(recipe => recipe.id !== recipeToDelete))
      alert('Công thức đã được xóa thành công!')
    } catch (error) {
      console.error('Delete recipe error:', error)
      alert('Có lỗi xảy ra khi xóa công thức. Vui lòng thử lại sau!')
    } finally {
      setShowDeleteConfirm(false)
      setRecipeToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setRecipeToDelete(null)
  }

  return (
    <div className="ai-recipes-page">
      <div className="ai-recipes-header">
        <h2>AI Recipe Generator</h2>
        <p>Tạo công thức nấu ăn thông minh dựa trên nguyên liệu có sẵn</p>
      </div>

      <div className="ai-recipes-content">
        {/* Input Form */}
        <div className="ai-recipes-form-section">
          <div className="form-container">
            <h3>Tạo công thức mới</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="ingredients">Nguyên liệu có sẵn:</label>
                <textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => handleInputChange('ingredients', e.target.value)}
                  placeholder="Nhập nguyên liệu cách nhau bởi dấu phẩy (ví dụ: thịt bò, hành tây, cà rốt, khoai tây)..."
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dietaryPreferences">Sở thích ăn uống:</label>
                <select
                  id="dietaryPreferences"
                  value={formData.dietaryPreferences}
                  onChange={(e) => handleInputChange('dietaryPreferences', e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Không có yêu cầu đặc biệt</option>
                  <option value="vegetarian">Ăn chay</option>
                  <option value="vegan">Thuần chay</option>
                  <option value="keto">Keto</option>
                  <option value="low-carb">Ít carb</option>
                  <option value="gluten-free">Không gluten</option>
                  <option value="dairy-free">Không sữa</option>
                  <option value="spicy">Thích cay</option>
                  <option value="mild">Không cay</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="cookingSkillLevel">Trình độ nấu ăn:</label>
                <select
                  id="cookingSkillLevel"
                  value={formData.cookingSkillLevel}
                  onChange={(e) => handleInputChange('cookingSkillLevel', e.target.value)}
                  disabled={isLoading}
                >
                  <option value="beginner">Mới bắt đầu</option>
                  <option value="intermediate">Trung bình</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>
              
              <button 
                type="submit"
                disabled={!formData.ingredients.trim() || isLoading}
                className="submit-btn"
              >
                {isLoading ? 'Đang tạo công thức...' : 'Tạo công thức'}
              </button>
            </form>
          </div>
        </div>

        {/* Recipes List */}
        <div className="ai-recipes-list-section">
          {/* Section Toggle */}
          <div className="section-toggle">
            <h3 
              className={`section-toggle-title ${activeSection === 'new' ? 'active' : ''}`}
              onClick={() => handleSectionToggle('new')}
            >
              Công thức đã tạo ({recipes.length})
            </h3>
            <h3 
              className={`section-toggle-title ${activeSection === 'old' ? 'active' : ''}`}
              onClick={() => handleSectionToggle('old')}
            >
              Công thức cũ ({oldRecipes.length})
            </h3>
            {activeSection === 'old' && (
              <button 
                className="refresh-btn"
                onClick={loadOldRecipes}
                disabled={isLoadingOldRecipes}
              >
                {isLoadingOldRecipes ? 'Đang tải...' : 'Làm mới'}
              </button>
            )}
          </div>

          {activeSection === 'new' ? (
            <>
              {recipes.length === 0 ? (
                <div className="empty-state">
                  <p>Chưa có công thức nào. Hãy tạo công thức đầu tiên!</p>
                </div>
              ) : (
                <div className="recipes-table">
                  <div className="recipes-table-inner">
                    <div className="recipes-header">
                      <div className="input-column">Nguyên liệu đầu vào</div>
                      <div className="output-column">Kết quả</div>
                      <div className="actions-column">Thao tác</div>
                    </div>
                    
                    <div className="recipes-body">
                    {recipes.map((recipe) => (
                      <div key={recipe.id} className="recipe-row">
                        <div className="input-cell">
                          <div className="input-content">
                            <div className="input-item">
                              <strong>Nguyên liệu:</strong> {recipe.input.ingredients}
                            </div>
                            <div className="input-item">
                              <strong>Sở thích:</strong> {recipe.input.dietaryPreferences}
                            </div>
                            <div className="input-item">
                              <strong>Trình độ:</strong> {recipe.input.cookingSkillLevel}
                            </div>
                            <div className="input-item">
                              <strong>Thời gian:</strong> {recipe.createdAt.toLocaleString('vi-VN')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="output-cell">
                          <div className="recipe-card">
                            <div className="recipe-header">
                              <h4 className="recipe-title">{recipe.output.dishName}</h4>
                              <div className="recipe-time">⏱️ {recipe.output.estimatedCookingTime}</div>
                            </div>
                            <div className="recipe-description">{recipe.output.description}</div>
                            
                            <div className="recipe-section">
                              <h5>🥬 Nguyên liệu:</h5>
                              <ul className="recipe-ingredients">
                                {recipe.output.ingredients.map((ingredient, index) => (
                                  <li key={index}>{ingredient}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="recipe-section">
                              <h5>👨‍🍳 Cách làm:</h5>
                              <ol className="recipe-instructions">
                                {recipe.output.instructions.map((instruction, index) => (
                                  <li key={index}>{instruction}</li>
                                ))}
                              </ol>
                            </div>
                            
                            {recipe.output.cookingTips && (
                              <div className="recipe-section">
                                <h5>💡 Mẹo nấu ăn:</h5>
                                <p className="recipe-tips">{recipe.output.cookingTips}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="actions-cell">
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteRecipe(recipe.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {isLoadingOldRecipes ? (
                <div className="loading-state">
                  <p>Đang tải danh sách công thức cũ...</p>
                </div>
              ) : oldRecipes.length === 0 ? (
                <div className="empty-state">
                  <p>Chưa có công thức cũ nào.</p>
                </div>
              ) : (
                <div className="recipes-table old-recipes-table">
                  <div className="recipes-table-inner">
                    <div className="recipes-header">
                      <div className="output-column">Kết quả</div>
                      <div className="actions-column">Thao tác</div>
                    </div>
                    
                    <div className="recipes-body">
                    {oldRecipes.map((recipe) => (
                      <div key={recipe.id} className="recipe-row">
                        <div className="output-cell">
                          <div className="recipe-card">
                            <div className="recipe-header">
                              <h4 className="recipe-title">{recipe.output.dishName}</h4>
                              <div className="recipe-time">⏱️ {recipe.output.estimatedCookingTime}</div>
                            </div>
                            <div className="recipe-description">{recipe.output.description}</div>
                            
                            <div className="recipe-section">
                              <h5>🥬 Nguyên liệu:</h5>
                              <ul className="recipe-ingredients">
                                {recipe.output.ingredients.map((ingredient, index) => (
                                  <li key={index}>{ingredient}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="recipe-section">
                              <h5>👨‍🍳 Cách làm:</h5>
                              <ol className="recipe-instructions">
                                {recipe.output.instructions.map((instruction, index) => (
                                  <li key={index}>{instruction}</li>
                                ))}
                              </ol>
                            </div>
                            
                            {recipe.output.cookingTips && (
                              <div className="recipe-section">
                                <h5>💡 Mẹo nấu ăn:</h5>
                                <p className="recipe-tips">{recipe.output.cookingTips}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="actions-cell">
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteRecipe(recipe.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay" onClick={cancelDelete}>
          <div className="delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-header">
              <h4>Xác nhận xóa công thức</h4>
            </div>
            <div className="delete-confirm-body">
              <p>Bạn có chắc chắn muốn xóa công thức này không?</p>
              <p className="delete-warning">Hành động này không thể hoàn tác!</p>
            </div>
            <div className="delete-confirm-actions">
              <button 
                className="delete-cancel-btn"
                onClick={cancelDelete}
              >
                Hủy
              </button>
              <button 
                className="delete-confirm-btn"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
