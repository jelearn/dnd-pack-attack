import "./formik-demo.css";
import { packAttack } from "./pack-attack.js";
import React, { Component } from "react";
import { render } from "react-dom";
import { withFormik } from "formik";
import * as Yup from "yup";
import classnames from "classnames";

const attack_history = []

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .min(2, "C'mon, your name is longer than that")
      .required("First name is required."),
    ac: Yup.number()
      .min(0, "C'mon, your name is longer than that")
      .required("Target AC is required."),
    cnt: Yup.number()
      .min(1, "Need at least one creature to attack")
      .required("Must specify the number of attacking creatures."),
    adv_cnt: Yup.number().min(
      0,
      "Can't have less then zero creatures with advantage"
    ),
    hit_mod: Yup.number(),
    dice: Yup.string()
      .min(3, "Provide a dice roll, e.g. 2d4+1 or 1d12")
      .matches(/^[0-9]+d[0-9]+(\+[0-9]+)?$/, "Must match dice roll pattern.")
      .required("Must specify a dice roll")
  }),

  mapPropsToValues: ({ attack }) => ({
    ...attack
  }),
  handleSubmit: (payload, { setSubmitting }) => {
    let result = packAttack({
      name: payload.name,
      ac: payload.ac,
      cnt: payload.cnt,
      adv_cnt: payload.adv_cnt,
      hit_mod: payload.hit_mod,
      dice: payload.dice
    });

    let result_message =
      result[0] +
      " " +
      payload.name +
      " hit for " +
      result[1] +
      " damage, with " +
      result[2] +
      " critical failures.";

    attack_history.unshift(result_message)
    
    setSubmitting(false);
  },
  displayName: "PackAttackForm"
});

const InputFeedback = ({ error }) =>
  error ? <div className="input-feedback">{error}</div> : null;

const Label = ({ error, className, children, ...props }) => {
  return (
    <label className="label" {...props}>
      {children}
    </label>
  );
};

const TextInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  ...props
}) => {
  const classes = classnames(
    "input-group",
    {
      "animated shake error": !!error
    },
    className
  );
  return (
    <div className={classes}>
      <Label htmlFor={id} error={error}>
        {label}
      </Label>
      <input
        id={id}
        className="text-input"
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
      <InputFeedback error={error} />
    </div>
  );
};
const PackAttackForm = (props) => {
  const {
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isSubmitting
  } = props;
  return (
    <form onSubmit={handleSubmit}>

          <TextInput
            id="name"
            type="text"
            label="Creature"
            placeholder="Name of creatures"
            error={touched.name && errors.name}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            id="ac"
            type="number"
            label="Target AC"
            placeholder="Target armor class"
            error={touched.ac && errors.ac}
            value={values.ac}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            id="cnt"
            type="number"
            label="Number of Creatures"
            placeholder="Enter number of creatures"
            error={touched.cnt && errors.cnt}
            value={values.cnt}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            id="adv_cnt"
            type="number"
            label="Attacks with advantage"
            placeholder="Enter number of attacks with advantage"
            error={touched.adv_cnt && errors.adv_cnt}
            value={values.adv_cnt}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            id="hit_mod"
            type="number"
            label="To hit modifier"
            placeholder="Enter to-hit roll modifier"
            error={touched.hit_mod && errors.hit_mod}
            value={values.hit_mod}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <TextInput
            id="dice"
            type="tet"
            label="Damage Roll"
            placeholder="Enter dice roll for damage, e.g. 2d4+4"
            error={touched.dice && errors.dice}
            value={values.dice}
            onChange={handleChange}
            onBlur={handleBlur}
          />

        <button
          type="button"
          className="outline"
          onClick={handleReset}
          disabled={!dirty || isSubmitting}
        >
          Reset
        </button>
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>

      {/* <DisplayFormikState {...props} /> */}

      <ul>
      {attack_history.map((item) => (
        <li>{item}</li>
      ))}
      </ul>
    </form>
  );
};

const PackAttackEnhancedForm = formikEnhancer(PackAttackForm);

// Helper for the demo
// import { MoreResources, DisplayFormikState } from './formik-demo';



class App extends Component {
  render() {
    return (
      <div className="app">
        <h1>Rolling pack attack damager for D&D</h1>
        <p>
          Using conjure animals and having them attack all at the same time?
          This form helps to you roll their attacks, criticals, damage, and
          misses all at once to save you (and your DM) time.
        </p>

        <PackAttackEnhancedForm
          attack={{
            name: "",
            ac: "",
            cnt: "",
            adv_cnt: "",
            hit_mod: "",
            dice: ""
          }}
        />
        {/* <MoreResources /> */}
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
