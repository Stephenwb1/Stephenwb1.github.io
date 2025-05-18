document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const myself = {
      name: formData.get("name"),
      age: Number(formData.get("age")),
      location: formData.get("location"),
      distance: Number(formData.get("distance")),
      years_training: Number(formData.get("years_training")),
      gender: formData.get("gender"),
      belt: formData.get("belt"),
      height: Number(formData.get("height")),
      weight: Number(formData.get("weight"))
    };

    localStorage.setItem("myself", JSON.stringify(myself));
    window.location.href = "results.html";
  });
});
